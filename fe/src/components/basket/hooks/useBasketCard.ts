import { useEffect, useState } from 'react';
import { ref as storageRef, getDownloadURL } from 'firebase/storage';

import { setBasketItemQty } from '../../../store';
import { strg } from '../../../shared/firebase';

import type { BasketCardProps } from '../BasketCard';

export const useBasketCard = (props: BasketCardProps) => {
  const { id, qty, imgPath } = props;

  const incr = () => setBasketItemQty({ itemId: id, qty: qty + 1 });
  const decr = () => setBasketItemQty({ itemId: id, qty: qty - 1 });

  const [imageUrl, setImageURL] = useState<string | undefined>(undefined);

  useEffect(() => {
    getDownloadURL(storageRef(strg, imgPath)).then((url) => setImageURL(url));
  }, [imgPath]);

  return {
    qty,
    imageUrl,
    incr,
    decr,
  };
};
