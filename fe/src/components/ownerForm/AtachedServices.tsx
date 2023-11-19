import React, { FC, useEffect, useCallback } from 'react';
import { ref, update } from 'firebase/database';

import { UseFormSetValue } from 'react-hook-form';

import { Heading, Flex, Button, Text, ListItem, UnorderedList, Divider } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

import { rtdb } from '../../shared/firebase';

import type { OwnerFormState } from './interfaces';
import type { Category as Service } from '../ShowcaseSection';
import type { User } from '../../store/index';

interface AttachedServiceProps {
  allServices: Service[];
  attachedServices: Service[];
  selectedUser: Partial<User>;
  setValue: UseFormSetValue<OwnerFormState>;
}

export const AttachedServices: FC<AttachedServiceProps> = (props) => {
  const { selectedUser, allServices, attachedServices, setValue } = props;

  const removeAttached = useCallback(
    async (serviceId: string, serviceTitle: string) => {
      if (!selectedUser?.id) return;
      if (!confirm(`Точно отвязать сервис ${serviceTitle} от пользователя ${selectedUser?.email}?`)) return;

      const clearedServices = attachedServices.filter((srvc) => srvc.id !== serviceId);
      const clearedOwnerOf = Object.fromEntries(clearedServices.map((srvc) => [srvc.id, true]));

      const updates = {
        [`users/${selectedUser.id}/ownerOf`]: clearedOwnerOf,
      };

      await update(ref(rtdb), updates);

      setValue('servicesOwned', clearedServices);
    },
    [attachedServices, selectedUser, setValue],
  );

  useEffect(() => {
    if (!selectedUser?.ownerOf) return;

    const attached = allServices.filter((service) => Object.keys(selectedUser.ownerOf).includes(service.id));

    setValue('servicesOwned', attached);
  }, [allServices, selectedUser, setValue]);

  if (!attachedServices.length) return null;

  return (
    <>
      <Divider />

      <Heading as='h3' pt={4} mb={2} fontSize='lg'>
        Прикрепленные сервисы
      </Heading>

      <UnorderedList pb={4}>
        {attachedServices.map(({ id, title }) => (
          <ListItem key={`${id}-${title}`}>
            <Flex w='full' alignItems='center' justifyContent='space-between'>
              <Text>{title}</Text>

              <Button size='lg' variant='outline' colorScheme='red' p={2} onClick={() => removeAttached(id, title)}>
                <DeleteIcon />
              </Button>
            </Flex>
          </ListItem>
        ))}
      </UnorderedList>

      <Divider />
    </>
  );
};
