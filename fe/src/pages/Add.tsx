import React, { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'effector-react';

import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

import { $globalStore } from '../store';
import { isManager } from '../utils';

import { ServiceForm } from '../components/serviceForm';
import { ItemForm } from '../components/itemForm';
import { OwnerForm } from '../components/ownerForm';

export const Add: FC = () => {
  const { user } = useStore($globalStore);
  const navigate = useNavigate();

  useEffect(() => {
    const pageIsAvalable = isManager(user?.role);
    if (pageIsAvalable) return;

    navigate('/');
  }, [user, navigate]);

  return (
    <Box as='main' h='full'>
      <Tabs isFitted variant='enclosed' defaultIndex={2}>
        <TabList mb='1em'>
          <Tab>Сервис</Tab>
          <Tab>Товар</Tab>
          <Tab>Владелец</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ServiceForm />
          </TabPanel>

          <TabPanel>
            <ItemForm />
          </TabPanel>

          <TabPanel>
            <OwnerForm />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
