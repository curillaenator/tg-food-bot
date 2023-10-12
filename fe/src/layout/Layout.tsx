import React, { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// import {
//   AlertDialog,
//   AlertDialogBody,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogContent,
//   AlertDialogOverlay,
//   AlertDialogCloseButton,
// } from '@chakra-ui/react';

import { Header } from '../components/header';

// import { useTelegram } from '../hooks/useTelegram';
import { useAuth } from '../hooks/useAuth';

import s from './layout.module.scss';

export const Layout: FC = () => {
  // const { tg, toggleCTA } = useTelegram();

  const { authWith, signOut } = useAuth();

  useEffect(() => {
    window.Telegram.WebApp.ready();
  }, []);

  return (
    <div className={s.layout}>
      <Header authWith={authWith} signOut={signOut} />
      <Outlet />
    </div>
  );
};
