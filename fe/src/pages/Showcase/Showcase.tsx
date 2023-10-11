import React, { FC } from 'react';

import { Card } from '../../components/card';

import { useShop } from '../../hooks/useShop';

import s from './showcase.module.scss';

export const Showcase: FC = () => {
  const { items, onIncrease, onDecrease } = useShop();

  return (
    <main className={s.container}>
      {items.map((item) => (
        <Card {...item} key={item.id} onIncrease={onIncrease} onDecrease={onDecrease} />
      ))}
    </main>
  );
};
