import React, { FC } from 'react';

import { Box, Accordion, Progress } from '@chakra-ui/react';

import { useDataQuery } from '../../hooks/useDataQuery';

import { ShowcaseSection } from '../../components/ShowcaseSection';

export const Main: FC = () => {
  const { loading, contentMap } = useDataQuery();

  // console.table(contentMap);

  return (
    <Box as='main'>
      {loading && <Progress isIndeterminate size='xs' />}

      <Accordion
        // defaultIndex={[0, 1, 2, 3, 4, 5, 6, 7, 8]}
        // allowMultiple
        allowToggle
      >
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
