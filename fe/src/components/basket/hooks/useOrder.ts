import { useStore } from 'effector-react';
// import { ref, child, push, update, get } from 'firebase/database';

import { $globalStore, resetBasket } from '../../../store';
// import { rtdb } from '../../../shared/firebase';

export const useOrder = (onBasketClose: () => void) => {
  const { basket } = useStore($globalStore);

  const onPlaceOrder = () => {
    console.log(basket);

    resetBasket();
    onBasketClose();
  };

  return {
    onPlaceOrder,
  };
};
