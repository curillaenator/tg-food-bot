import React, { FC, useState } from 'react';
import { Card, Flex, CardBody, Stack, Text, Button, Divider, Progress, Link } from '@chakra-ui/react';

import { useDetailes as useDetails } from './hooks/useDetailes';
import { useAccomplish } from './hooks/useAccomplish';

import { VNpricer } from '../../utils';

import { EMERGENCY_ASSOC } from './constants';
import { DELIVERY_PRICE } from '../../shared/constants';

import type { PickedContentProps } from './interfaces';

export const PickedContent: FC<PickedContentProps> = (props) => {
  const { id, customer, emergency, placed, currentUserId, executorId, content } = props;

  const { name, tel, tme, adress } = customer;

  const {
    loading: isDetailsloading,
    details,
    totalApplicationPrice,
  } = useDetails({ currentUserId, executorId, content });

  const { loading: isAcomlishInProcess, accomplish } = useAccomplish();

  const [telString, setTelString] = useState<string>(tel);

  if (isDetailsloading || isAcomlishInProcess) return <Progress w='full' size='sm' isIndeterminate />;

  return (
    <Stack gap={4} h='full' justifyContent='space-between'>
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

      <Stack gap={2}>
        <Stack gap={0}>
          <Text fontSize='sm' color='chakra-subtle-text'>
            Адрес:
          </Text>
          <Text fontSize='sm' fontWeight='bold'>
            {adress}
          </Text>
        </Stack>

        <Stack gap={2}>
          <Text fontSize='sm' color='chakra-subtle-text'>
            Телефон:
          </Text>

          <Button
            w='full'
            size='sm'
            onClick={() => {
              navigator.clipboard.writeText(tel);
              setTelString('Номер скопирован');
              setTimeout(() => setTelString(tel), 1200);
            }}
          >
            {telString}
          </Button>

          {customer?.tme && (
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
            >
              {customer.tme}
            </Link>
          )}
        </Stack>

        <Stack>
          <Text fontSize='sm' color='chakra-subtle-text'>
            Состав заказа:
          </Text>

          {details.map((serviceId) => (
            <Card
              key={serviceId.id}
              p={2}
              bg='chakra-body-bg'
              borderRadius={8}
              boxShadow='inset 0 0 0 1px var(--pixpax-colors-whiteAlpha-200)'
            >
              <CardBody p={0}>
                <Text fontWeight='bold'>{serviceId?.title}</Text>

                <Divider />

                {serviceId.order.map((item) => (
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

                <Divider />

                <Text fontSize='sm' w='full' textAlign='right' fontWeight='bold'>
                  {VNpricer.format(+serviceId.totalServicePrice)}
                </Text>
              </CardBody>
            </Card>
          ))}

          <Flex h='100%' justifyContent='space-between'>
            <Text fontSize='sm'>Доставка:</Text>
            <Text fontSize='sm' textAlign='right' fontWeight='bold'>
              {VNpricer.format(DELIVERY_PRICE)}
            </Text>
          </Flex>

          <Flex h='100%' justifyContent='space-between'>
            <Text fontSize='lg'>Итог:</Text>
            <Text fontSize='lg' textAlign='right' fontWeight='bold'>
              {VNpricer.format(totalApplicationPrice + DELIVERY_PRICE)}
            </Text>
          </Flex>
        </Stack>
      </Stack>

      <Stack w='full'>
        <Button
          w='full'
          size='sm'
          colorScheme='red'
          //  isDisabled={pickIsDisabled || !!executorId}
          onClick={() =>
            accomplish({
              id,
              details,
              customerName: name,
              customerTel: tel,
              customerAdress: adress,
              executorId,
              totalApplicationPrice,
            })
          }
        >
          Завершить
        </Button>
      </Stack>
    </Stack>
  );
};
