import React, { FC } from 'react';

import s from './styles.module.scss';
import type { CardProps } from './interfaces';

export const Card: FC<CardProps> = (props) => {
  const { id, title, description, imgPath, price, onSelect } = props;

  return (
    <button className={s.card} type='button' onClick={onSelect}>
      <div className={s.image}>{!!imgPath ? <img src={imgPath} alt={title} /> : <span>no image</span>}</div>

      <h3 className={s.title}>{title}</h3>

      <span className={s.price}>{price}</span>

      <span className={s.description}>{description}</span>
    </button>
  );
};

export type { CardProps };
