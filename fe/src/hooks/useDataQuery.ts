import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { ref, onValue, get, child } from 'firebase/database';

import { rtdb } from '../shared/firebase';

import type { Category } from '../components/ShowcaseSection';

type ParamName = 'categoryId' | 'serviceId' | 'showcaseId';

export const useDataQuery = () => {
  const { categoryId, serviceId, showcaseId } = useParams<Record<ParamName, string>>();
  const { search } = useLocation();

  const [categories, setCategories] = useState<Record<string, Category[]>>({});
  const [services, setServices] = useState<Record<string, Category>>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!!categoryId || !!serviceId || !!showcaseId) return;

    setCategories({});
    setLoading(true);

    const usubscribeCategories = onValue(ref(rtdb, 'categories'), (snap) => {
      if (snap.exists()) {
        const data = snap.val() as Record<string, Record<string, Category>>;

        const linkedCategories = Object.keys(data).map((key) => {
          const categories = Object.entries(data[key]).map(([id, category]) => {
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
            };
          });

          return [key, categories];
        });

        setCategories(Object.fromEntries(linkedCategories));
        setLoading(false);
      }
    });

    return () => usubscribeCategories();
  }, [categoryId, serviceId, showcaseId]);

  useEffect(() => {
    if (!categoryId) return;

    setCategories({});
    setLoading(true);

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

      if (!!servicesCleared.length) setServices(Object.fromEntries(servicesCleared));

      const servicesWithItemsPromise = servicesCleared.map(async ([serviceName, serviceItem]) => {
        if (!serviceItem.categories) return [];

        const itemsPromises = Object.entries(serviceItem.categories)
          .filter(([itemId, isActiveItem]) => !!itemId && isActiveItem)
          .map(([itemId]) =>
            get(child(ref(rtdb), `items/${itemId}`)).then((snap) => {
              if (snap.exists()) return { id: itemId, ...snap.val() } as Category;
            }),
          );

        return Promise.all(itemsPromises).then((serviceItems) => [serviceName, { categories: serviceItems }]);
      });

      Promise.all(servicesWithItemsPromise).then((withCategoriesMap) => {
        console.log(withCategoriesMap);

        const servicesWithItems = Object.fromEntries(withCategoriesMap) as Record<string, Partial<Category>>;
        const servicesToSet = services.map(([k]) => [k, (servicesWithItems[k]?.categories || []) as Category[]]);

        setCategories(Object.fromEntries(servicesToSet));
        setLoading(false);
      });
    });
  }, [search, categoryId, serviceId, showcaseId]);

  return {
    loading,
    services,
    contentMap: Object.entries(categories),
  };
};
