import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

import { FB_CONFIG } from './shared/firebase';

import './index.scss';

const app = initializeApp(FB_CONFIG);

getAnalytics(app);

const appContainer = document.querySelector('#root') as Element;
const root = createRoot(appContainer);

root.render(<App />);
