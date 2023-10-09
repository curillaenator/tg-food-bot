import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { ref as storageRef, getDownloadURL } from 'firebase/storage';

import { strg, rtdb } from '../shared/firebase';
import { snapToMap } from '../utils/snapToMap';

import type { CardProps } from '../components/card';

const itemsRef = ref(rtdb, 'menu');

const getImageURL = (path: string) => getDownloadURL(storageRef(strg, `dishes/${path}`));

export const useShop = () => {
  const [items, setItems] = useState<CardProps[]>([]);

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
  }, []);

  return {
    items,
  };
};
