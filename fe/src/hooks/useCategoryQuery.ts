import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';

import { rtdb } from '../shared/firebase';

import { setSidebar } from '../store';

import type { Category, CategoryDbName, SidebarItem } from '../shared/interfaces';

const CATEGORY_ORDER: Record<CategoryDbName, number> = {
  food: 1,
  ' beverages': 2,
  utilities: 3,
  retail: 4,
};

export const useCategoryQuery = () => {
  const [categories, setCategories] = useState<Record<string, Category[]>>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setCategories({});
    setLoading(true);

    const usubscribeCategories = onValue(ref(rtdb, 'categories'), (snap) => {
      const data = (snap.exists() ? snap.val() : {}) as Record<string, Record<string, Category>>;

      const mainCategories = Object.entries(data).map(([mainKey, catalog]) => {
        const subCategories = Object.entries(catalog)
          .map(([subKey, categories]) => {
            if (!categories?.categories) return { id: subKey, ...categories, to: '/' };

            const serviceIds = Object.entries(categories.categories)
              .filter(([serviceId, isActiveItem]) => !!serviceId && isActiveItem)
              .map(([serviceId]) => serviceId);

            return {
              id: subKey,
              ...categories,
              to: `category/${mainKey.trim()}-${subKey}?services=${JSON.stringify(serviceIds)}`,
            } as Category;
          })
          .filter(({ categories }) => !!categories);

        return [mainKey, subCategories] as [string, Category[]];
      });

      const sidebar: Record<string, SidebarItem[]> = Object.fromEntries(
        mainCategories.map(([catKey, catContent]) =>
          // @ts-expect-error to is not in types
          [catKey, catContent.map(({ id, title, to }) => ({ id, title, to }))],
        ),
      );

      setSidebar(sidebar);

      setCategories(Object.fromEntries(mainCategories));
      setLoading(false);
    });

    return () => usubscribeCategories();
  }, []);

  return {
    loading,
    categories: Object.entries(categories).sort(([a], [b]) => CATEGORY_ORDER[a] - CATEGORY_ORDER[b]),
  };
};
