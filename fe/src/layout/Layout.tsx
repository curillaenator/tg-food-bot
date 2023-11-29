import React, { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import cn from 'classnames';

import { UserSection } from '../components/userSection';

import { useTelegram } from '../hooks/useTelegram';
// import { useUpdateImageMeta } from '../hooks/useUpdateImageMeta';

import s from './layout.module.scss';

export const Layout: FC = () => {
  // useUpdateImageMeta();
  const { tg, tgUser, tgQueryId } = useTelegram();

  useEffect(() => {
    if (!!tg) {
      tg.ready();
      tg.expand();

      console.log(window.Telegram);

      // tg.onEvent('')
    }
  }, [tg]);

  return (
    <div className={cn(s.layout, s.bg_cats)}>
      <UserSection />
      <Outlet />

      <div>{tgUser?.id || 'no user'}</div>
      <div>{tgQueryId || 'no Id'}</div>
    </div>
  );
};
