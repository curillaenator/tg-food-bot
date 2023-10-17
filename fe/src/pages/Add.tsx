import React, { FC } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useStore } from 'effector-react';

import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

// import { $globalStore } from '../store';

import { ServiceForm } from '../components/serviceForm';

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
          <Tab>Service</Tab>
          <Tab>Item</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ServiceForm />
          </TabPanel>

          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
