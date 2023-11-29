import { useStore } from 'effector-react';
import { ref, child, push, set } from 'firebase/database';

import { useTelegram } from '../../../hooks/useTelegram';

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

  const { tgQueryId } = useTelegram();

  const onPlaceOrder = async () => {
    try {
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

      await set(ref(rtdb, `orders/${orderId}`), order);

      await fetch('5.35.13.184:6006/bot-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          queryId: tgQueryId,
          orderId,
          title: 'Спасибо за Ваш заказ!!!',
          clientSupport: 'По вопросу заказа можно связаться с ...',
          order,
        }),
      });

      resetBasket();
    } catch (error) {
      console.log(error);
    }

    onBasketClose();
  };

  return {
    onPlaceOrder,
  };
};
