import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { ref as storageRef, getDownloadURL } from 'firebase/storage';

import { strg, rtdb } from '../shared/firebase';
import { snapToMap, numberize } from '../utils';

import type { CardProps } from '../components/card/Card';

const itemsRef = ref(rtdb, 'menu');

const getImageURL = (path: string) => getDownloadURL(storageRef(strg, `dishes/${path}`));

export const useShop = () => {
  const [items, setItems] = useState<CardProps[]>([]);
  const [total, setTotal] = useState<number>(0);

  const onIncrease = (itemId: string) => {
    setItems((prev) =>
      prev.map((card) => {
        if (itemId === card.id) return { ...card, qty: (card.qty || 0) + 1 };
        return card;
      }),
    );

    setTotal((prev) => prev + 1);
  };

  const onDecrease = (itemId: string) => {
    setItems((prev) =>
      prev.map((card) => {
        if (itemId === card.id) return { ...card, qty: card.qty - 1 };
        return card;
      }),
    );

    setTotal((prev) => prev + 1);
  };

  useEffect(() => {
    onValue(itemsRef, (snap) => {
      if (snap.exists()) {
        const data = snapToMap(snap.val() as Record<string, CardProps>).map(async (card) => {
          if (!card.imgPath) return card;

          const imgPath = await getImageURL(card.imgPath);

          return {
            ...card,
            imgPath,
          };
        });

        Promise.all(data).then((cards) => setItems(cards));
      }
    });

    return () => off(itemsRef);
  }, []);

  return {
    items,
    onIncrease,
    onDecrease,
  };
};
