import React, { FC } from 'react';
import { Box, Accordion, Progress } from '@chakra-ui/react';
import { useServicesQuery } from '../hooks/useServicesQuery';
import { ShowcaseSection } from '../components/ShowcaseSection';

export const Category: FC = () => {
  const { loading, categories: services, onRemoveItem, onRemoveService } = useServicesQuery();

  return (
    <Box as='main'>
      {loading && <Progress isIndeterminate size='xs' />}

      <Accordion allowMultiple>
        {services.map(([serviceId, content]) => (
          <ShowcaseSection
            {...content}
            key={serviceId}
            id={serviceId}
            onMenuItemRemove={(serviceId, itemId) => onRemoveItem(`${serviceId}/${itemId}`)}
            onRemoveService={onRemoveService}
          />
        ))}
      </Accordion>
    </Box>
  );
};
