import React, { FC } from 'react';

import { Box, Accordion } from '@chakra-ui/react';

import { useDataQuery } from '../../hooks/useDataQuery';

import { ShowcaseSection } from '../../components/ShowcaseSection';

export const Main: FC = () => {
  const { contentMap } = useDataQuery();

  return (
    <Box as='main'>
      <Accordion defaultIndex={[0]} allowMultiple>
        {contentMap.map(([contentName, content]) => (
          <ShowcaseSection
            key={contentName}
            id={contentName}
            title={contentName}
            description=''
            imgPath=''
            categories={content}
          />
        ))}
      </Accordion>
    </Box>
  );
};
