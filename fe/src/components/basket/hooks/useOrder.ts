import { useStore } from 'effector-react';
import { ref, child, push, set } from 'firebase/database';

import { $globalStore, resetBasket, type ShowcaseItem } from '../../../store';
import { rtdb } from '../../../shared/firebase';

import type { Application } from '../../../shared/interfaces';

const group = (basket: ShowcaseItem[]) => {
  const grouped: Record<string, Record<string, number>> = {};

  basket.forEach((item) => {
    if (!grouped[item.parent]) grouped[item.parent] = {};
    grouped[item.parent][item.id] = item.qty;
  });

  return grouped;
};

export const useOrder = (onBasketClose: () => void) => {
  const { user, basket } = useStore($globalStore);

  const onPlaceOrder = () => {
    const orderId = push(child(ref(rtdb), 'orders')).key;

    const order: Application = {
      // id: orderId,
      customer: user.id,
      placed: String(+new Date()),
      status: 'open',
      executor: null,
      content: group(basket),
      expectedTime: '',
    };

    set(ref(rtdb, `orders/${orderId}`), order).then(() => {
      resetBasket();
      onBasketClose();

      console.table(order);

      // TODO тг шлет ответ пользаку с номером заказа

      // window.Telegram.WebApp.sendData(order)
      // window.Telegram.WebApp.close()
    });
  };

  return {
    onPlaceOrder,
  };
};
