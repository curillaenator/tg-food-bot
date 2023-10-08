import React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './pages';

// import { initializeApp } from 'firebase/app';
// import { getAnalytics } from 'firebase/analytics';

// import './index.scss';

// const app = initializeApp({
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGING_SENDER_ID,
//   appId: process.env.APP_ID,
//   measurementId: process.env.MEASUREMENT_ID,
// });

// getAnalytics(app);

const appContainer = document.querySelector('#root') as Element;
const root = createRoot(appContainer);

root.render(<App />);
