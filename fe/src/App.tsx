import React, { FC, useEffect } from 'react';
import { Button } from './components/button';
import { Card } from './components/card';

import { useTelegram } from './hooks/useTelegram';
import { useShop } from './hooks/useShop';

import styles from './app.module.scss';

export const App: FC = () => {
  const { tg, toggleCTA } = useTelegram();
  const { items } = useShop();

  console.log(items);

  useEffect(() => {
    window.Telegram.WebApp.ready();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span>{`Greatings ${tg.initDataUnsafe?.user?.first_name || 'N/A'}!`}</span>
      </header>

      <main className={styles.main}>
        {items.map((item) => (
          <Card key={item.id} {...item} />
        ))}
      </main>

      {/* <Button type='button' size='l' onClick={toggleCTA} fullwidth>
        Order
      </Button> */}
    </div>
  );
};
