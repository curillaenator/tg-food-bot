import axios from 'axios';
import { useStore } from 'effector-react';
import { useToast } from '@chakra-ui/react';
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

  const toast = useToast();

  const onPlaceOrder = async () => {
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

    await set(ref(rtdb, `orders/${orderId}`), order)
      .then(() => {
        if (!tgQueryId) {
          toast({
            title: 'Спасибо!',
            description: 'Ващ заказ создан',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        }
      })
      .catch((rtdbErr) => {
        toast({
          title: 'Ошибка RTDB',
          description: rtdbErr.message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      });

    resetBasket();
    onBasketClose();

    if (!!tgQueryId) {
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
        .catch((tgErr) => {
          toast({
            title: 'Ошибка TGBT',
            description: tgErr.message,
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
        });
    }
  };

  return {
    onPlaceOrder,
  };
};
