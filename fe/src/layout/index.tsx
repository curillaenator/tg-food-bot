import React, { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from '../components/header';

import { useTelegram } from '../hooks/useTelegram';

import s from './layout.module.scss';

export const Layout: FC = () => {
  const { tg, toggleCTA } = useTelegram();

  useEffect(() => {
    window.Telegram.WebApp.ready();
  }, []);

  return (
    <div className={s.layout}>
      <Header />
      <Outlet />
    </div>
  );
};
