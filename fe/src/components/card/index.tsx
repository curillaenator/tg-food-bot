import React, { FC } from 'react';
import { ref, set } from 'firebase/database';

import { strg, rtdb } from '../../shared/firebase';
import { HeartIcon, ClockIcon } from '../icon';

import s from './styles.module.scss';
import type { CardProps } from './interfaces';

export const Card: FC<CardProps> = (props) => {
  const { id, title, description, imgPath, price, onSelect = () => {}, waitTime, likes } = props;

  const onLike = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();

    set(ref(rtdb, `menu/${id}/likes`), +likes + 1);
  };

  return (
    <button
      className={s.card}
      type='button'
      onClick={() => {
        onSelect();
      }}
    >
      <div className={s.content}>
        <div className={s.image}>{!!imgPath ? <img src={imgPath} alt={title} /> : <span>no image</span>}</div>

        <h3 className={s.title}>{title}</h3>

        <span className={s.price}>{price}</span>

        <span className={s.description}>{description}</span>
      </div>

      <div className={s.footer}>
        <div className={s.badge}>
          <ClockIcon className={s.clock} />
          <span>{waitTime}</span>
        </div>

        {!!likes && (
          <span role='button' className={s.likeButton} onClick={onLike}>
            <span>{likes}</span>
            <HeartIcon className={s.likes} />
          </span>
        )}
      </div>
    </button>
  );
};

export type { CardProps };
