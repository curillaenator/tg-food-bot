import React, { FC } from 'react';

import { Box, Accordion, Progress } from '@chakra-ui/react';

import { useDataQuery } from '../hooks/useDataQuery';

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
  const { loading, services, contentMap } = useDataQuery();

  return (
    <Box as='main'>
      {loading && <Progress isIndeterminate size='xs' />}

      <Accordion
        allowMultiple
        // defaultIndex={[0, 1, 2, 3, 4, 5, 6, 7]}
      >
        {contentMap.map(([serviceId, content]) => (
          <ShowcaseSection
            key={serviceId}
            id={serviceId}
            parent={services[serviceId]?.parent}
            title={CATEGORIES_ASSOC[serviceId]['caption']}
            description={services[serviceId]?.description}
            // imgPath={services[serviceId]?.imgPath}
            imgPath={CATEGORIES_ASSOC[serviceId]['imgPath']}
            type='category'
            categories={content || []}
          />
        ))}
      </Accordion>
    </Box>
  );
};
