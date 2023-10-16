import { useState, useEffect } from 'react';
import { ref, child, get } from 'firebase/database';
import { ref as storageRef, getDownloadURL } from 'firebase/storage';

import { rtdb, strg } from '../../../shared/firebase';

import type { BasketCardProps } from '../BasketCard';

export const useBasketCard = (props: BasketCardProps) => {
  const { id, price, updateTotalPrice } = props;

  const [imgURL, setImgURL] = useState<string | undefined>(undefined);
  const [qty, setQty] = useState<number>(1);

  useEffect(() => {
    get(child(ref(rtdb), `items/${id}`)).then(async (snap) => {
      if (!snap.exists()) return;
      setImgURL(await getDownloadURL(storageRef(strg, snap.val().imgPath)));
    });
  }, [id]);

  useEffect(() => updateTotalPrice(id, +price * qty), [id, price, qty, updateTotalPrice]);

  return {
    imgURL,
    qty,
    incr: () => setQty((prev) => prev + 1),
    decr: () => setQty((prev) => prev - 1),
  };
};
