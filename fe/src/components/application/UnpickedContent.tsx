import React, { FC } from 'react';

import { Flex, Stack, Text, Button } from '@chakra-ui/react';

import { EMERGENCY_ASSOC } from './constants';
import type { UnpickedContentProps } from './interfaces';

export const UnpickedContent: FC<UnpickedContentProps> = (props) => {
  const {
    customerName,
    customerAdress,
    emergency,
    executorName,
    placed,
    pickIsDisabled,
    executorId,
    status,
    onAplicationPick,
  } = props;

  return (
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
            {customerAdress}
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
          <Button w='full' size='sm' isDisabled={pickIsDisabled || !!executorId} onClick={onAplicationPick}>
            Принять
          </Button>
        )}
      </Flex>
    </Stack>
  );
};
