import React, { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import cn from 'classnames';

import { UserSection } from '../components/userSection';

// import { useTelegram } from '../hooks/useTelegram';
// import { useUpdateImageMeta } from '../hooks/useUpdateImageMeta';

import s from './layout.module.scss';

export const Layout: FC = () => {
  // const { tg, toggleCTA } = useTelegram();
  // useUpdateImageMeta();

  useEffect(() => {
    window.Telegram.WebApp.ready();
  }, []);

  return (
    <div className={cn(s.layout, s.bg_wowwy)}>
      <UserSection />
      <Outlet />
    </div>
  );
};
