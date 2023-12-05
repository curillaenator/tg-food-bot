import React, { FC } from 'react';
import { Box, Accordion, Progress } from '@chakra-ui/react';

import { useCategoryQuery } from '../hooks/useCategoryQuery';
import { ShowcaseSection } from '../components/ShowcaseSection';
import type { CategoryDbName } from '../shared/interfaces';

interface CategoryUiDictionary {
  caption: string;
  imgPath: string;
}

const CATEGORIES_ASSOC: Record<CategoryDbName, CategoryUiDictionary> = {
  ' beverages': {
    caption: 'Напитки / Beverages',
    imgPath: 'main/beverages.jpg',
  },
  food: {
    caption: 'Еда / Food',
    imgPath: 'main/food.jpg',
  },
  utilities: {
    caption: 'Услуги / Services',
    imgPath: 'main/utilities.jpg',
  },
  retail: {
    caption: 'Магазины / Shops',
    imgPath: 'main/retail.jpg',
  },
};

export const Main: FC = () => {
  const { loading, categories } = useCategoryQuery();

  return (
    <Box as='main'>
      {loading && <Progress isIndeterminate size='xs' />}

      <Accordion allowMultiple>
        {categories.map(([categoryId, subcategories]) => (
          <ShowcaseSection
            id={categoryId}
            key={categoryId}
            type='category'
            title={CATEGORIES_ASSOC[categoryId]['caption']}
            description={undefined}
            imgPath={CATEGORIES_ASSOC[categoryId]['imgPath']}
            categories={subcategories}
          />
        ))}
      </Accordion>
    </Box>
  );
};
