import React, { FC, useCallback, useState } from 'react';
import { Card, Flex, CardBody, Stack, Text, Button, Divider, Progress, Link, Input, useToast } from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';

import { useTelegram } from '../../hooks/useTelegram';

import { useDetailes as useDetails } from './hooks/useDetailes';
import { useAccomplish } from './hooks/useAccomplish';

import { VNpricer } from '../../utils';

import { EMERGENCY_ASSOC } from './constants';
import { DELIVERY_PRICE, TOAST_DURATION } from '../../shared/constants';

import type { PickedContentProps } from './interfaces';

export const PickedContent: FC<PickedContentProps> = (props) => {
  const { id, customer, emergency, placed, currentUserId, executorId, content } = props;

  const { tg } = useTelegram();

  const toast = useToast();

  const { name, tel, tme, adress } = customer;

  const {
    loading: isDetailsloading,
    details,
    totalApplicationPrice,
  } = useDetails({ currentUserId, executorId, content });

  const { loading: isAcomlishInProcess, accomplish } = useAccomplish();

  const [payed, setPayed] = useState<string>('');

  const onCopy = useCallback(
    (text: string) => {
      navigator.clipboard.writeText(text);

      toast({
        title: 'Скопировано',
        description: text,
        status: 'success',
        duration: TOAST_DURATION,
        isClosable: true,
      });
    },
    [toast],
  );

  if (isDetailsloading || isAcomlishInProcess) return <Progress w='full' size='sm' isIndeterminate />;

  return (
    <Stack w='full' gap={2}>
      <Flex w='full' gap={4} justifyContent='space-between'>
        <Stack gap={0}>
          <Text fontSize='sm' color='chakra-subtle-text'>
            Клиент:
          </Text>
          <Text fontSize='sm' fontWeight='bold'>
            {name}
          </Text>
        </Stack>

        <Stack gap={0}>
          <Text fontSize='sm' textAlign='right' color='chakra-subtle-text'>
            Размещен:
          </Text>
          <Text color={EMERGENCY_ASSOC[emergency]} fontSize='sm' textAlign='right' fontWeight='bold'>
            {placed}
          </Text>
        </Stack>
      </Flex>

      <Stack gap={0}>
        <Text fontSize='sm' color='chakra-subtle-text'>
          Адрес:
        </Text>
        <Text fontSize='sm' fontWeight='bold'>
          {adress}
        </Text>
      </Stack>

      <Stack gap={0}>
        <Text fontSize='sm' color='chakra-subtle-text'>
          Телефон/Контакт:
        </Text>

        <Flex gap='8px' w='full' alignItems='center' justifyContent='space-between'>
          <Text fontSize='sm' fontWeight='bold'>
            {tel}
          </Text>

          <Button variant='outline' size='sm' colorScheme='orange' p={0} onClick={() => onCopy(tel)}>
            <CopyIcon boxSize={6} />
          </Button>
        </Flex>
      </Stack>

      {customer.tme && (
        <Stack gap={2}>
          <Text fontSize='sm' color='chakra-subtle-text'>
            Написать напрямую:
          </Text>

          <Link
            display='flex'
            alignItems='center'
            justifyContent='center'
            w='full'
            h='32px'
            href={`https://${tme}`}
            isExternal
            boxShadow='inset 0 0 0 1px var(--pixpax-colors-telegram-200)'
            p={2}
            bg='var(--pixpax-colors-telegram-200)'
            borderRadius={8}
            color='telegram.900'
            fontWeight='bold'
            onClick={() => {
              if (!!tg) setTimeout(() => tg.close(), 100);
            }}
          >
            {customer.tme}
          </Link>
        </Stack>
      )}

      <Divider my={2} />

      <Stack>
        <Text fontSize='sm' fontWeight='bold'>
          Состав заказа:
        </Text>

        {details.map((service) => (
          <Card
            key={service.id}
            p={2}
            bg='chakra-body-bg'
            borderRadius={8}
            boxShadow='inset 0 0 0 1px var(--pixpax-colors-whiteAlpha-200)'
          >
            <CardBody p={0}>
              <Text fontWeight='bold'>{service?.title}</Text>

              {service?.adress && (
                <Flex gap='8px' w='full' alignItems='center' justifyContent='space-between'>
                  <Text fontSize='sm' fontWeight='bold' color='chakra-subtle-text'>
                    {service.adress}
                  </Text>

                  <Button variant='outline' size='sm' colorScheme='orange' p={0} onClick={() => onCopy(service.adress)}>
                    <CopyIcon boxSize={6} />
                  </Button>
                </Flex>
              )}

              <Divider my={2} />

              {service.order.map((item) => (
                <Flex fontSize='sm' key={item.id} w='full' justifyContent='space-between'>
                  <Text flexShrink={0} color='chakra-subtle-text'>
                    {item.title}
                  </Text>

                  <Flex w='70%' justifyContent='flex-end'>
                    <Text fontSize='sm' w='12%' textAlign='right' color='chakra-subtle-text'>
                      {item.qty}
                    </Text>
                    <Text fontSize='sm' w='50%' textAlign='right' color='chakra-subtle-text'>
                      {VNpricer.format(+item.price)}
                    </Text>
                  </Flex>
                </Flex>
              ))}

              <Divider my={2} />

              <Text fontSize='sm' w='full' textAlign='right' fontWeight='bold'>
                {VNpricer.format(+service.totalServicePrice)}
              </Text>
            </CardBody>
          </Card>
        ))}

        <Flex h='100%' justifyContent='space-between'>
          <Text fontSize='sm'>Доставка:</Text>
          <Text fontSize='sm' textAlign='right' fontWeight='bold'>
            {VNpricer.format(DELIVERY_PRICE * details.length)}
          </Text>
        </Flex>

        <Flex h='100%' justifyContent='space-between'>
          <Text fontSize='lg'>Итог:</Text>
          <Text fontSize='lg' textAlign='right' fontWeight='bold'>
            {VNpricer.format(totalApplicationPrice + DELIVERY_PRICE * details.length)}
          </Text>
        </Flex>
      </Stack>

      <Divider my={2} />

      <Input
        placeholder='Оплаченная сумма'
        borderColor='orange.200'
        size='sm'
        type='number'
        value={payed}
        _placeholder={{ color: 'orange.200' }}
        onChange={(e) => setPayed(e.target.value)}
      />

      <Button
        w='full'
        size='sm'
        colorScheme={payed ? 'green' : 'red'}
        onClick={() => accomplish({ id, details, customer, executorId, totalApplicationPrice, payed })}
      >
        {payed ? 'Завершить' : 'Отменить'}
      </Button>
    </Stack>
  );
};
