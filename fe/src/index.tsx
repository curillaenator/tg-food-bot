import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import {
  ChakraProvider,
  ColorModeScript,
  extendTheme,
  // withDefaultColorScheme,
  type ThemeConfig,
} from '@chakra-ui/react';

import { Layout } from './layout';
import { Settings, Showcase } from './pages';

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

const theme = extendTheme(
  {
    fonts: {
      body: 'Inter, sans-serif',
      heading: 'Inter, sans-serif',
      mono: 'Menlo, monospace',
    },
    config: {
      initialColorMode: 'dark',
      useSystemColorMode: false,
      cssVarPrefix: 'pixpax',
    },
  },
  // withDefaultColorScheme(),
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
