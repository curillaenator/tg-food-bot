import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import { getAnalytics } from 'firebase/analytics';

import { app } from './shared/firebase';

import './index.scss';

getAnalytics(app);

const appContainer = document.querySelector('#root') as Element;
const root = createRoot(appContainer);

root.render(<App />);
