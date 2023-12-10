import React, { FC, useState, useCallback } from 'react';
import { collection, doc, setDoc } from 'firebase/firestore';

import { Stack, Input, FormControl, FormLabel, Button, Heading, useToast } from '@chakra-ui/react';

import { firedb } from '../../shared/firebase';
import { TOAST_DURATION } from '../../shared/constants';

import s from './styles.module.scss';

export const PartnerForm: FC = () => {
  const [partnerId, setPartnerId] = useState<string>('');
  const [partnerEmail, setPartnerEmail] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const toast = useToast();

  const verifyPartner = useCallback(() => {
    if (!confirm('Все верно указано?')) return;

    setLoading(true);

    setDoc(doc(collection(firedb, 'serviceOwners'), partnerId), { email: partnerEmail })
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
  }, [partnerId, partnerEmail, toast]);

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

        <FormControl isRequired>
          <FormLabel fontSize='sm' htmlFor='pixpax-partner-id'>
            Укажи email по которому зарегистрировался партнер:
          </FormLabel>

          <Input
            size='md'
            autoComplete='off'
            id='pixpax-partner-id'
            placeholder='тот который он ввощдит при логине'
            value={partnerEmail}
            onChange={(e) => setPartnerEmail(e.target.value)}
          />
        </FormControl>

        <Button
          isLoading={loading}
          isDisabled={!partnerId || !partnerEmail}
          size='md'
          onClick={verifyPartner}
          type='button'
        >
          Верифицировать
        </Button>
      </Stack>
    </form>
  );
};
