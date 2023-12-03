import { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ref, onValue, get, child } from 'firebase/database';

import { rtdb } from '../shared/firebase';

import type { Category, CategoryDbName } from '../shared/interfaces';

const CATEGORY_ORDER: Record<CategoryDbName, number> = {
  food: 1,
  ' beverages': 2,
  utilities: 3,
  retail: 4,
};

export const useDataQuery = () => {
  const { categoryId } = useParams<Record<'categoryId', string>>();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const [lastRemovedId, setLastRemovedId] = useState<string | null>(null);

  const onRemoveItem = useCallback((itemId: string) => setLastRemovedId(itemId), []);

  const onRemoveService = useCallback(
    (itemId: string) => {
      const searchParams = new URLSearchParams(search);
      const { value } = searchParams.values().next();

      const requiredServises = JSON.stringify((JSON.parse(value) as string[]).filter((id) => id !== itemId));

      navigate(`${pathname}?categories=${requiredServises}`);
    },
    [search, pathname, navigate],
  );

  const [categories, setCategories] = useState<Record<string, Category[]>>({});
  const [services, setServices] = useState<Record<string, Category>>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!!categoryId) return;

    setCategories({});
    setLoading(true);

    const usubscribeCategories = onValue(ref(rtdb, 'categories'), (snap) => {
      if (snap.exists()) {
        const data = snap.val() as Record<string, Record<string, Category>>;

        const linkedCategories = Object.keys(data).map((key) => {
          const categories = Object.entries(data[key]).map(([id, category]) => {
            let queryString = !!category.categories ? '?services=' : '';

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
  }, [categoryId, lastRemovedId]);

  useEffect(() => {
    if (!categoryId) return;

    setCategories({});
    setLoading(true);

    const searchParams = new URLSearchParams(search);
    const { value } = searchParams.values().next();

    const requiredServisesIds = JSON.parse(value) as string[];

    const servicePromises = requiredServisesIds.map((serviceId) => {
      return get(child(ref(rtdb), `services/${serviceId}`)).then((snap) => {
        if (snap.exists()) return [serviceId, snap.val()] as [string, Category];
        return null;
      });
    });

    Promise.all(servicePromises).then((services) => {
      const servicesCleared = services.filter((s) => !!s[1].isActive);

      if (!!servicesCleared.length) setServices(Object.fromEntries(servicesCleared));

      const servicesWithItemsPromise = servicesCleared.map(async ([serviceId, srvc]) => {
        if (!srvc.categories) return [];

        const itemsPromises = Object.entries(srvc.categories)
          .filter(([itemId, isActiveItem]) => !!itemId && isActiveItem)
          .map(([itemId]) =>
            get(child(ref(rtdb), `items/${itemId}`)).then((snap) => {
              if (snap.exists()) return { id: itemId, ...snap.val() } as Category;
            }),
          );

        return Promise.all(itemsPromises).then((serviceItems) => [serviceId, { categories: serviceItems }]);
      });

      Promise.all(servicesWithItemsPromise).then((withCategoriesMap) => {
        const servicesWithItems = Object.fromEntries(withCategoriesMap) as Record<string, Partial<Category>>;
        const servicesToSet = services.map(([k]) => [k, (servicesWithItems[k]?.categories || []) as Category[]]);

        setCategories(Object.fromEntries(servicesToSet));
        setLoading(false);
      });
    });
  }, [search, categoryId, lastRemovedId]);

  return {
    loading,
    services,
    contentMap: Object.entries(categories).sort(([a], [b]) => CATEGORY_ORDER[a] - CATEGORY_ORDER[b]),
    onRemoveItem,
    onRemoveService,
  };
};
