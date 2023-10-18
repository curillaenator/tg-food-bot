import React, { FC } from 'react';

import { Card, Flex, CardBody, Stack, Text, Button, Progress, Divider } from '@chakra-ui/react';

import { useApplication } from './hooks/useApplication';
import { useDetailes as useDetails } from './hooks/useDetailes';

import { EMERGENCY_ASSOC } from './constants';
import { DELIVERY_PRICE } from '../../shared/constants';
import type { Application as ApllicationType } from '../../shared/interfaces';

import { VNpricer } from '../../utils';

type ApplicationProps = ApllicationType & {
  onAplicationPick: (application: ApllicationType) => void;
  pickIsDisabled: boolean;
  currentUserId: string;
};

export const Application: FC<ApplicationProps> = (props) => {
  const { onAplicationPick, pickIsDisabled, status, currentUserId, content } = props;

  const {
    customerName = 'загружаю...',
    customeAdress = 'загружаю...',
    customeTel = 'загружаю...',
    executorName,
    executorId,
    placed,
    emergency,
  } = useApplication(props);

  const {
    loading: detailsLoading,
    details,
    totalApplicationPrice,
  } = useDetails({ currentUserId, executorId, content });

  const isUnpicked = currentUserId !== executorId;

  if (detailsLoading) return <Progress w='full' size='sm' isIndeterminate />;

  return (
    <Card
      h='full'
      p={2}
      bg='var(--color-bg-cutom)'
      borderRadius={12}
      boxShadow={`inset 0 0 0 1px var(--pixpax-colors-${EMERGENCY_ASSOC[emergency]}-400)`}
    >
      <CardBody p={0}>
        {isUnpicked && (
          <Stack gap={4} h='full' justifyContent='space-between'>
            <Stack gap={2}>
              <Stack gap={0}>
                <Text fontSize='sm' color='chakra-subtle-text'>
                  Клиент:
                </Text>
                <Text fontSize='sm' fontWeight='bold'>
                  {customerName}
                </Text>
              </Stack>

              <Stack gap={0}>
                <Text fontSize='sm' color='chakra-subtle-text'>
                  Адрес:
                </Text>
                <Text fontSize='sm' fontWeight='bold'>
                  {customeAdress}
                </Text>
              </Stack>

              <Stack gap={0}>
                <Text fontSize='sm' color='chakra-subtle-text'>
                  Размещен:
                </Text>
                <Text color={EMERGENCY_ASSOC[emergency]} fontSize='sm' fontWeight='bold'>
                  {placed}
                </Text>
              </Stack>

              {executorName && (
                <Stack gap={0}>
                  <Text fontSize='sm' color='chakra-subtle-text'>
                    Исполнитель:
                  </Text>
                  <Text fontSize='sm' fontWeight='bold'>
                    {executorName}
                  </Text>
                </Stack>
              )}
            </Stack>

            <Flex w='full'>
              {status === 'open' && (
                <Button
                  w='full'
                  size='sm'
                  isDisabled={pickIsDisabled || !!executorId}
                  onClick={() => onAplicationPick(props)}
                >
                  Принять
                </Button>
              )}
            </Flex>
          </Stack>
        )}

        {details.length && !isUnpicked && (
          <Stack gap={4} h='full' justifyContent='space-between'>
            <Flex w='full' gap={4} justifyContent='space-between'>
              <Stack gap={0}>
                <Text fontSize='sm' color='chakra-subtle-text'>
                  Клиент:
                </Text>
                <Text fontSize='sm' fontWeight='bold'>
                  {customerName}
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
                  {customeAdress}
                </Text>
              </Stack>

              <Stack gap={0}>
                <Text fontSize='sm' color='chakra-subtle-text'>
                  Телефон:
                </Text>
                <Text fontSize='sm' fontWeight='bold'>
                  {customeTel}
                </Text>
              </Stack>

              <Stack>
                <Text fontSize='sm' color='chakra-subtle-text'>
                  Состав заказа:
                </Text>

                {details.map((serviceId) => {
                  return (
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
                  );
                })}

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

            <Flex w='full'>
              <Button
                w='full'
                size='sm'
                //  isDisabled={pickIsDisabled || !!executorId}
                //  onClick={() => onAplicationPick(props)}
              >
                Завершить
              </Button>
            </Flex>
          </Stack>
        )}
      </CardBody>
    </Card>
  );
};
