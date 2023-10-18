import React, { FC, useState, useEffect } from 'react';

import { Box, Stack, SimpleGrid, Heading, Radio, RadioGroup, Divider } from '@chakra-ui/react';

import { Application } from '../components/application';

import { useDashboard } from '../hooks/useDashboard';

import type { Application as ApplicationType } from '../shared/interfaces';

type FilterFnType = (el: ApplicationType) => boolean;

export const Dashboard: FC = () => {
  const { orders, onAplicationPick, pickIsDisabled, employeeId } = useDashboard();

  const [dash, setDash] = useState<string>('all');
  const [filterFn, setFilterFn] = useState<FilterFnType>(() => (el: ApplicationType) => !el?.executor);

  useEffect(() => {
    if (dash == 'mine') {
      setFilterFn(() => {
        return (el: ApplicationType) => el?.executor === employeeId;
      });
    }

    if (dash === 'all') {
      setFilterFn(() => {
        return (el: ApplicationType) => !el?.executor;
      });
    }
  }, [dash, employeeId]);

  return (
    <Box as='main' px={4} pb={4}>
      <RadioGroup onChange={(e) => setDash(e)} value={dash} mb={4}>
        <Stack direction='row' w='full' gap={8}>
          <Radio value='all'>Все</Radio>
          <Radio value='mine'>Мои</Radio>
        </Stack>
      </RadioGroup>

      <Divider />

      <Heading fontSize='xl' py={4}>
        Заявки
      </Heading>

      {!!employeeId && (
        <SimpleGrid columns={dash === 'all' ? 2 : 1} spacing={2}>
          {orders.filter(filterFn).map((appl) => (
            <Application
              key={appl.id}
              {...appl}
              currentUserId={employeeId}
              onAplicationPick={onAplicationPick}
              pickIsDisabled={pickIsDisabled}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};
