import React, { FC, useEffect } from 'react';

import styles from './app.module.scss';

export const App: FC = () => {
  useEffect(() => {
    window.Telegram.WebApp.ready();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Food app</h1>
      </header>

      <main className={styles.main}>
        <button type='button' onClick={() => window.Telegram.WebApp.close()}>
          close
        </button>
      </main>
    </div>
  );
};
