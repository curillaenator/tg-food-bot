import { useState, useEffect } from 'react';
import { ref, child, get } from 'firebase/database';
import { ref as storageRef, getDownloadURL } from 'firebase/storage';

import { rtdb, strg } from '../../../shared/firebase';
import { setBasketItemQty } from '../../../store';

import type { BasketCardProps } from '../BasketCard';

export const useBasketCard = (props: BasketCardProps) => {
  const { id, price, qty = 1, updateTotalPrice } = props;

  const [imgURL, setImgURL] = useState<string | undefined>(undefined);

  const incr = () => setBasketItemQty({ itemId: id, qty: qty + 1 });
  const decr = () => setBasketItemQty({ itemId: id, qty: qty - 1 });

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
    incr,
    decr,
  };
};
