import { useEffect, useState, useCallback } from 'react';
import { ref, child, get } from 'firebase/database';
import type { Options } from 'chakra-react-select';

import { rtdb } from '../../../shared/firebase';

import type { CustomOption } from '../interfaces';
import type { Category } from '../../../shared/interfaces';

export const useCategoriesQuery = () => {
  const [currentCategory, setCurrentCategory] = useState<CustomOption>({ label: '', value: '' });
  const handleCurrentCategory = useCallback((current: CustomOption) => setCurrentCategory(current), []);

  const [categories, setCategories] = useState<Options<CustomOption>>([]);
  const [subcategories, setSubcategories] = useState<Options<CustomOption>>([]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);

    get(child(ref(rtdb), 'categories'))
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.val() as Record<string, Record<string, Category>>;

          const mapedData = Object.entries(data).map(([categoryName]) => {
            const trimedName = categoryName.trim();

            return {
              label: trimedName.slice(0, 1).toUpperCase() + trimedName.slice(1),
              value: categoryName,
            };
          });

          setCategories(mapedData);
        }
      })
      .catch((err) => console.table(err))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setLoading(true);

    get(child(ref(rtdb), `categories/${currentCategory.value}`))
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.val() as Record<string, Category>;

          const mapedData = Object.entries(data).map(([subcategoryId, subcategory]) => ({
            label: subcategory.title,
            value: subcategoryId,
          }));

          setSubcategories(mapedData);
        }
      })
      .catch((err) => console.table(err))
      .finally(() => {
        setLoading(false);
      });
  }, [currentCategory]);

  return {
    loading,
    categories,
    subcategories,
    handleCurrentCategory,
  };
};
