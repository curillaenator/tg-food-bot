import React, { FC } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useStore } from 'effector-react';

import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

// import { $globalStore } from '../store';

import { ServiceForm } from '../components/serviceForm';
import { ItemForm } from '../components/itemForm';

export const Add: FC = () => {
  // const { user } = useStore($globalStore);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const pageIsAvalable = !!user?.id && (user.role === 'admin' || user.role === 'manager');
  //   if (pageIsAvalable) return;

  //   navigate('/');
  // }, [user, navigate]);

  return (
    <Box as='main' h='full'>
      <Tabs isFitted variant='enclosed'>
        <TabList mb='1em'>
          <Tab>Новый сервис</Tab>
          <Tab>Новый товар</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ServiceForm />
          </TabPanel>

          <TabPanel>
            <ItemForm />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
