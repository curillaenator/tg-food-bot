import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.scss';

const appContainer = document.querySelector('#root') as Element;
const root = createRoot(appContainer);

root.render(<div>Hello</div>);
