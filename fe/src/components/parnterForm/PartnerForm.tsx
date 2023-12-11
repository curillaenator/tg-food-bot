import React, { FC, useState, useCallback } from 'react';
import { ref, get } from 'firebase/database';
import { collection, doc, setDoc } from 'firebase/firestore';

import { Stack, Input, FormControl, FormLabel, Button, Heading, useToast } from '@chakra-ui/react';

import { firedb, rtdb } from '../../shared/firebase';
import { TOAST_DURATION } from '../../shared/constants';

import type { User } from '../../shared/interfaces';
import s from './styles.module.scss';

export const PartnerForm: FC = () => {
  const [partnerId, setPartnerId] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const toast = useToast();

  const verifyPartner = useCallback(async () => {
    if (!confirm('Все верно указано?')) return;

    setLoading(true);

    const isValidUserSnap = await get(ref(rtdb, `users/${partnerId}`));

    if (!isValidUserSnap.exists()) {
      setLoading(false);

      toast({
        title: 'Ошибка',
        description: 'Нет такого пользователя',
        status: 'error',
        duration: TOAST_DURATION,
        isClosable: true,
      });

      return;
    }

    const { id, email, name, tme, tel } = isValidUserSnap.val() as User;

    setDoc(doc(collection(firedb, 'serviceOwners'), partnerId), {
      id,
      email,
      name: name || '',
      tme: tme || '',
      tel: tel || '',
    })
      .then(() => {
        toast({
          title: 'Готово',
          description:
            'Партнер верифицирован. Нужно обновить Pixpax, после чего партнер появиться в списке добавления владельцев',
          status: 'success',
          duration: TOAST_DURATION,
          isClosable: true,
        });
      })
      .catch(() => {
        toast({
          title: 'Ошибка',
          description: 'Перезагрузи и попробуй еще раз',
          status: 'error',
          duration: TOAST_DURATION,
          isClosable: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [partnerId, toast]);

  return (
    <form className={s.form}>
      <Heading fontSize='xl'>Добавить партнера</Heading>

      <Stack gap={2}>
        <FormControl isRequired>
          <FormLabel fontSize='sm' htmlFor='pixpax-partner-id'>
            Укажи верный ID партнера:
          </FormLabel>

          <Input
            size='md'
            autoComplete='off'
            id='pixpax-partner-id'
            placeholder='из сообщения c ID'
            value={partnerId}
            onChange={(e) => setPartnerId(e.target.value)}
          />
        </FormControl>

        <Button isLoading={loading} isDisabled={!partnerId} size='md' onClick={verifyPartner} type='button'>
          Верифицировать
        </Button>
      </Stack>
    </form>
  );
};
