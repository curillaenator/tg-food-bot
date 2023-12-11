import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'effector-react';

import { useCouriers } from '../hooks/useCouriers';

import { isManager } from '../utils';

import { Input, FormControl, FormLabel, Button, Stack, Card, CardBody, Text } from '@chakra-ui/react';

import { $globalStore } from '../store';

import styles from './styles.module.scss';

export const Couriers: FC = () => {
  const { user } = useStore($globalStore);
  const navigate = useNavigate();

  useEffect(() => {
    const pageIsAvalable = user?.id && isManager(user?.role);

    if (pageIsAvalable) return;

    navigate('/');
  }, [user, navigate]);

  const { courierList, courierId, setCourierId, addCourier, fireCourier } = useCouriers();

  return (
    <Stack as='main' h='full' px={4} pb={4} gap={2}>
      <form className={styles.form} onSubmit={addCourier}>
        <FormControl isRequired>
          <FormLabel fontSize='sm'>ID нового курьера</FormLabel>
          <Input
            size='md'
            type='text'
            autoComplete='off'
            placeholder='ID нового курьера'
            value={courierId}
            onChange={(e) => setCourierId(e.target.value)}
          />
        </FormControl>

        <Button size='md' w='full' type='submit'>
          Добавить курьера
        </Button>
      </form>

      <Stack w='full' gap={2}>
        {courierList.map(({ id, email, name, tel, tme }) => (
          <Card
            key={id}
            p={2}
            bg='var(--color-bg-cutom)'
            borderRadius={12}
            boxShadow='inset 0 0 0 1px var(--pixpax-colors-whiteAlpha-400)'
          >
            <CardBody display='flex' flexDirection='column' w='full' gap='4px' p={0}>
              <Text fontSize='md'>{name}</Text>
              <Text fontSize='md' color='chakra-subtle-text'>
                {email}
              </Text>
              <Text fontSize='md' color='chakra-subtle-text'>
                {tel}
              </Text>
              <Text fontSize='md' color='chakra-subtle-text'>
                {tme}
              </Text>

              <Button size='md' w='full' variant='outline' color='red.400' onClick={() => fireCourier(id)}>
                Уволить
              </Button>
            </CardBody>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};
