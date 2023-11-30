import { useStore } from 'effector-react';
import axios from 'axios';
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

      resetBasket();
      onBasketClose();

      await axios
        .post(
          process.env.TG_BOT_API,
          {
            queryId: tgQueryId,
            orderId,
            title: 'Спасибо за Ваш заказ!!!',
            clientSupport: 'По вопросу заказа можно связаться с ...',
            order,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .then((res) => {
          console.log(res);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    onPlaceOrder,
  };
};
