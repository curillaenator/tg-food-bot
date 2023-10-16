import React, { FC } from 'react';

import { Box, Accordion, Progress } from '@chakra-ui/react';

import { useDataQuery } from '../../hooks/useDataQuery';

import { ShowcaseSection } from '../../components/ShowcaseSection';

export const Main: FC = () => {
  const { loading, contentMap } = useDataQuery();

  return (
    <Box as='main'>
      {loading && <Progress isIndeterminate size='xs' />}

      <Accordion allowToggle>
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
