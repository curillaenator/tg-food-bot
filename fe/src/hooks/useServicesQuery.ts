import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ref, get, child } from 'firebase/database';

import { rtdb } from '../shared/firebase';

import type { Category } from '../shared/interfaces';

export const useServicesQuery = () => {
  // const { categoryId } = useParams<Record<'categoryId', string>>();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const [lastRemovedId, setLastRemovedId] = useState<string | null>(null);

  const onRemoveItem = useCallback((itemId: string) => setLastRemovedId(itemId), []);

  const onRemoveService = useCallback(
    (itemId: string) => {
      const searchParams = new URLSearchParams(search);
      const { value } = searchParams.values().next();

      const servicesIds = JSON.stringify((JSON.parse(value) as string[]).filter((id) => id !== itemId));

      navigate(`${pathname}?services=${servicesIds}`);
    },
    [search, pathname, navigate],
  );

  const [categories, setCategories] = useState<Record<string, Category>>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setCategories({});
    setLoading(true);

    const searchParams = new URLSearchParams(search);
    const { value } = searchParams.values().next();

    const requiredServisesIds = JSON.parse(value) as string[];

    const servicePromises = requiredServisesIds.map((serviceId) =>
      get(child(ref(rtdb), `services/${serviceId}`)).then(
        (snap) => [serviceId, snap.exists() ? snap.val() : {}] as [string, Category],
      ),
    );

    Promise.all(servicePromises).then((services) => {
      const servicesCleared = services.filter(([srvsId, srvc]) => srvsId.length && srvc.isActive);

      const serviceWithItemsPromises = servicesCleared.map(async ([serviceId, srvc]) => {
        if (!srvc.categories) return [serviceId, { ...srvc, categories: [] }] as [string, Category];

        const itemsPromises = Object.entries(srvc.categories)
          .filter(([itemId, isActiveItem]) => !!itemId && isActiveItem)
          .map(([itemId]) =>
            get(child(ref(rtdb), `items/${itemId}`)).then(
              (snap) => ({ id: itemId, ...(snap.exists() ? snap.val() : {}) }) as Category,
            ),
          );

        return Promise.all(itemsPromises).then(
          (items) => [serviceId, { ...srvc, categories: items }] as [string, Category],
        );
      });

      Promise.all(serviceWithItemsPromises)
        .then((serviceWithItems) => {
          setCategories(Object.fromEntries(serviceWithItems) as Record<string, Category>);
        })
        .finally(() => setLoading(false));
    });
  }, [search, lastRemovedId]);

  return {
    loading,
    categories: Object.entries(categories),
    onRemoveItem,
    onRemoveService,
  };
};
