import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { ref, onValue, get, child } from 'firebase/database';
import { ref as storageRef, getDownloadURL } from 'firebase/storage';

import { rtdb, strg } from '../shared/firebase';

import type { Category } from '../components/ShowcaseSection';

type ParamName = 'categoryId' | 'serviceId' | 'showcaseId';

export const useDataQuery = () => {
  const { categoryId, serviceId, showcaseId } = useParams<Record<ParamName, string>>();
  const { search } = useLocation();

  const [categories, setCategories] = useState<Record<string, Category[]>>({});

  useEffect(() => {
    if (!!categoryId || !!serviceId || !!showcaseId) return;

    setCategories({});

    const usubscribeCategories = onValue(ref(rtdb, 'categories'), (snap) => {
      if (snap.exists()) {
        const data = snap.val() as Record<string, Record<string, Category>>;

        Object.keys(data).forEach((key) => {
          const promises = Object.entries(data[key]).map(async ([id, category]) => {
            const imgPath = await getDownloadURL(storageRef(strg, category.imgPath));

            let queryString = !!category.categories ? '?categories=' : '';

            if (!!category.categories) {
              const serviceIds = Object.entries(category.categories)
                .filter(([serviceId, isActiveItem]) => !!serviceId && isActiveItem)
                .map(([serviceId]) => serviceId);

              queryString = `${queryString}${JSON.stringify(serviceIds)}`;
            }

            return {
              id,
              ...category,
              to: `category/${id}${queryString}`,
              imgPath,
            };
          });

          Promise.all(promises).then((resolvedCategory) => {
            setCategories((prev) => ({ ...prev, [key]: resolvedCategory }));
          });
        });
      }
    });

    return () => usubscribeCategories();
  }, [categoryId, serviceId, showcaseId]);

  useEffect(() => {
    if (!categoryId) return;

    const searchParams = new URLSearchParams(search);
    const { value } = searchParams.values().next();

    const requiredServises = JSON.parse(value) as string[];

    const servicePromises = requiredServises.map((serviseName) => {
      return get(child(ref(rtdb), `services/${serviseName}`)).then((snap) => {
        if (snap.exists()) return [serviseName, snap.val()] as [string, Category];
        return null;
      });
    });

    Promise.all(servicePromises).then((services) => {
      const servicesCleared = services.filter((s) => !!s[1]) as [string, Category][];

      const servicesWithItemsPromise = servicesCleared.map(async ([serviceName, serviceMenu]) => {
        const serviseItemsPromises = Object.entries(serviceMenu.categories)
          .filter(([itemId, isActiveItem]) => !!itemId && isActiveItem)
          .map(([itemId]) => {
            return get(child(ref(rtdb), `items/${itemId}`)).then((snap) => {
              if (snap.exists()) return { id: itemId, ...snap.val() } as Category;
            });
          });

        return Promise.all(serviseItemsPromises).then((serviceItems) => [serviceName, { categories: serviceItems }]);
      });

      Promise.all(servicesWithItemsPromise).then((res) => {
        const servicesWithItems = Object.fromEntries(res) as Category[];

        const servicesToSetPromise = services.map(async ([k]) => {
          const imagedItemsPromises = (servicesWithItems[k].categories as Category[]).map(async (item) => {
            return {
              ...item,
              imgPath: await getDownloadURL(storageRef(strg, item.imgPath)),
            };
          });

          const resolvedValue = await Promise.all(imagedItemsPromises);

          return [k, resolvedValue]; // .then((res) => console.log(res));
        });

        Promise.all(servicesToSetPromise).then((result) => setCategories(Object.fromEntries(result)));
      });
    });
  }, [search, categoryId, serviceId, showcaseId]);

  return {
    contentMap: Object.entries(categories),
  };
};
