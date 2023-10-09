import React, { FC, useEffect } from 'react';
import { Button } from './components/button';

import { useTelegram } from './hooks/useTelegram';

import styles from './app.module.scss';

export const App: FC = () => {
  const { tg, toggleCTA } = useTelegram();

  useEffect(() => {
    window.Telegram.WebApp.ready();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        {/* <h1>Food app</h1> */}
        <span>{`Greatings ${tg.initDataUnsafe?.user?.first_name || 'N/A'}`}</span>
      </header>

      <main className={styles.main}></main>

      <Button type='button' size='l' onClick={toggleCTA} fullwidth>
        Order
      </Button>
    </div>
  );
};
