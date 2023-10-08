import React, { FC } from 'react';

import './index.scss';
import styles from './app.module.scss';

export const App: FC = () => {
  console.log(window.Telegram);

  return <div>Hello!</div>;
};
