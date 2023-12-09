import React, { FC, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Stack, SimpleGrid, Heading, Radio, RadioGroup, Divider } from '@chakra-ui/react';

import { Application } from '../components/application';

import { useDashboard } from '../hooks/useDashboard';

import type { Application as ApplicationType } from '../shared/interfaces';

export const Dashboard: FC = () => {
  const { orders, pickIsDisabled, currentUser, onAplicationPick } = useDashboard();
  const navigate = useNavigate();

  useEffect(() => {
    const pageIsAvalable = !!currentUser?.id && (currentUser?.role === 'admin' || currentUser?.role === 'manager');
    if (pageIsAvalable) return;

    navigate('/');
  }, [currentUser, navigate]);

  const [dash, setDash] = useState<string>('all');

  const filters = useMemo(
    () => ({
      all: (el: ApplicationType) => !el?.executor,
      mine: (el: ApplicationType) => el?.executor === currentUser?.id,
    }),
    [currentUser],
  );

  return (
    <Box as='main' px={4} pb={4}>
      <RadioGroup value={dash} mb={4} onChange={(e) => setDash(e)}>
        <Stack direction='row' w='full' gap={8}>
          <Radio value='all'>Все</Radio>
          <Radio value='mine'>Мои</Radio>
        </Stack>
      </RadioGroup>

      <Divider />

      <Heading fontSize='xl' py={4}>
        Заявки
      </Heading>

      {!!currentUser?.id && (
        <SimpleGrid columns={dash === 'all' ? 2 : 1} spacing={2}>
          {orders.filter(filters[dash]).map((application) => (
            <Application
              {...application}
              key={application.id}
              currentUserId={currentUser.id}
              onAplicationPick={onAplicationPick}
              pickIsDisabled={pickIsDisabled}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};
