import React, { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import cn from 'classnames';

import { UserSection } from '../components/userSection';

// import { useTelegram } from '../hooks/useTelegram';

import s from './layout.module.scss';

export const Layout: FC = () => {
  // const { tg, toggleCTA } = useTelegram();

  useEffect(() => {
    window.Telegram.WebApp.ready();
  }, []);

  return (
    <div className={cn(s.layout, s.bg_playfull)}>
      <UserSection />
      <Outlet />
    </div>
  );
};
