import React, { FC, useRef, useEffect, useCallback } from 'react';
import { ref, update, onValue, type Unsubscribe } from 'firebase/database';

import { UseFormSetValue } from 'react-hook-form';

import { Heading, Flex, Button, Text, ListItem, UnorderedList, Divider, useToast } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

import { rtdb } from '../../shared/firebase';
import { TOAST_DURATION } from '../../shared/constants';

import type { OwnerFormState } from './interfaces';
import type { User, Category as Service } from '../../shared/interfaces';

interface AttachedServiceProps {
  servicesList: Service[];
  servicesOwned: Service[];
  selectedUser: Partial<User>;
  setValue: UseFormSetValue<OwnerFormState>;
}

export const AttachedServices: FC<AttachedServiceProps> = (props) => {
  const { selectedUser, servicesList, servicesOwned, setValue } = props;

  const toast = useToast();

  const removeAttached = useCallback(
    async (serviceId: string, serviceTitle: string) => {
      if (!selectedUser?.id) return;

      if (!confirm(`Точно отвязать сервис ${serviceTitle} от пользователя ${selectedUser?.email}?`)) return;

      const clearedServices = servicesOwned.filter((srvc) => srvc.id !== serviceId);

      const updates = {
        [`users/${selectedUser.id}/ownerOf`]: Object.fromEntries(clearedServices.map((srvc) => [srvc.id, true])),
      };

      await update(ref(rtdb), updates);

      toast({
        title: 'Готово',
        description: 'Сервис отвязан',
        status: 'warning',
        duration: TOAST_DURATION,
        isClosable: true,
      });
    },
    [servicesOwned, selectedUser, toast],
  );

  const unsubUserOwnerOf = useRef<Unsubscribe>(null);

  useEffect(() => {
    if (!selectedUser?.id) return;

    if (unsubUserOwnerOf.current) {
      console.log('prev usubed: ', unsubUserOwnerOf.current);
      unsubUserOwnerOf.current();
    }

    unsubUserOwnerOf.current = onValue(ref(rtdb, `users/${selectedUser.id}/ownerOf`), (snap) => {
      const ownedServicesIds = ((snap.exists() ? Object.entries(snap.val()) : []) as [string, boolean][]).map(
        ([serviceId]) => serviceId,
      );

      setValue(
        'servicesOwned',
        servicesList.filter((service) => ownedServicesIds.includes(service.id)),
      );
    });

    return () => unsubUserOwnerOf.current();
  }, [selectedUser, servicesList, setValue]);

  if (!selectedUser?.id) return null;

  return (
    <>
      <Divider />

      <Heading as='h3' fontSize='sm' color='chakra-subtle-text'>
        {!servicesOwned.length ? 'Нет прикрепленных сервисов' : 'Прикрепленные сервисы:'}
      </Heading>

      <UnorderedList p={0}>
        {servicesOwned.map(({ id, title }) => (
          <ListItem key={`${id}-${title}`}>
            <Flex w='full' alignItems='center' justifyContent='space-between'>
              <Text>{title}</Text>

              <Button size='sm' variant='outline' colorScheme='red' p={2} onClick={() => removeAttached(id, title)}>
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
