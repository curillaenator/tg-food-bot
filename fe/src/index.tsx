import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  withDefaultColorScheme,
  type ThemeConfig,
} from '@chakra-ui/react';

import { Layout } from './layout';
import { Main, Add, Category, Dashboard, ServicePage, Reports } from './pages';

import './index.scss';

const appContainer = document.querySelector('#root') as Element;
const root = createRoot(appContainer);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route index element={<Main />} />
      <Route path='category/:categoryId' element={<Category />} />
      <Route path='orders' element={<Dashboard />} />
      <Route path='add' element={<Add />} />
      <Route path='service' element={<ServicePage />} />
      <Route path='reports' element={<Reports />} />

      <Route path='*' element={<Main />} />
    </Route>,
  ),
);

const theme = extendTheme(
  {
    fonts: {
      body: 'SanFrancisco, sans-serif',
      heading: 'SanFrancisco, sans-serif',
      mono: 'Menlo, monospace',
    },

    config: {
      initialColorMode: 'dark',
      useSystemColorMode: false,
      cssVarPrefix: 'pixpax',
    },
  },
  withDefaultColorScheme({ colorScheme: 'telegram' }),
);

if (!!localStorage.getItem('chakra-ui-color-mode')) {
  localStorage.setItem('chakra-ui-color-mode', (theme.config as ThemeConfig).initialColorMode);
}

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode='dark' />
      <RouterProvider router={router} fallbackElement={<div>подождите...</div>} />
    </ChakraProvider>
  </React.StrictMode>,
);
