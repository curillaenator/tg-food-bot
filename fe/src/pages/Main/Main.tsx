import React, { FC } from 'react';

import { Box, Accordion, Progress } from '@chakra-ui/react';

import { useDataQuery } from '../../hooks/useDataQuery';

import { ShowcaseSection } from '../../components/ShowcaseSection';

export const Main: FC = () => {
  const { loading, services, contentMap } = useDataQuery();

  return (
    <Box as='main'>
      {loading && <Progress isIndeterminate size='xs' />}

      <Accordion allowToggle>
        {contentMap.map(([serviceName, content]) => (
          <ShowcaseSection
            key={serviceName}
            id={serviceName}
            title={serviceName}
            description={services[serviceName]?.description}
            imgPath={services[serviceName]?.imgPath}
            type={services[serviceName]?.type}
            categories={content}
          />
        ))}
      </Accordion>
    </Box>
  );
};
