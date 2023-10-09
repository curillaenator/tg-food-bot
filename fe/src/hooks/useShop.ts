import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';

import { app } from '../shared/firebase';
import { snapToMap } from '../utils/snapToMap';

import type { CardProps } from '../components/card';

const db = getDatabase(app);
const st = getStorage(app);
const itemsRef = ref(db, 'menu');

const getImageURL = (path: string) => getDownloadURL(storageRef(st, `dishes/${path}`));

export const useShop = () => {
  const [items, setItems] = useState<CardProps[]>([]);

  useEffect(() => {
    onValue(itemsRef, (snap) => {
      if (snap.exists()) {
        const data = snapToMap(snap.val() as Record<string, CardProps>).map(async (card) => {
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
