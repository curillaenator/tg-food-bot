import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import { Layout } from './layout';

import { Settings, Showcase } from './pages';

import theme from './shared/chakra';

import './index.scss';

const appContainer = document.querySelector('#root') as Element;
const root = createRoot(appContainer);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route index element={<Showcase />} />
      <Route path='settings' element={<Settings />} />

      <Route path='*' element={<Showcase />} />
    </Route>,
  ),
);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} fallbackElement={<div>подождите...</div>} />
    </ChakraProvider>
  </React.StrictMode>,
);
