import React, { FC } from 'react';

import { Box, Accordion, Progress } from '@chakra-ui/react';

import { useDataQuery } from '../hooks/useDataQuery';

import { ShowcaseSection } from '../components/ShowcaseSection';

import type { CategoryDbName } from '../shared/interfaces';

const CATEGORIES_ASSOC: Record<CategoryDbName, string> = {
  ' beverages': ' Напитки / Beverages',
  food: 'Еда / Food',
  utilities: 'Услуги / Services',
  retail: 'Магазины / Shops',
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
        {contentMap.map(([serviceName, content]) => (
          <ShowcaseSection
            key={serviceName}
            id={serviceName}
            parent={services[serviceName]?.parent}
            title={CATEGORIES_ASSOC[serviceName]}
            description={services[serviceName]?.description}
            imgPath={services[serviceName]?.imgPath}
            type={services[serviceName]?.type}
            categories={content || []}
          />
        ))}
      </Accordion>
    </Box>
  );
};
