import { useState } from 'react';
import axios from 'axios';
import { useStore } from 'effector-react';
import { useToast } from '@chakra-ui/react';
import { ref, child, push, set } from 'firebase/database';

import { useTelegram } from '../../../hooks/useTelegram';
import { VNpricer } from '../../../utils';

import { $globalStore, resetBasket, type ShowcaseItem } from '../../../store';
import { rtdb } from '../../../shared/firebase';

import { DELIVERY_PRICE } from '../../../shared/constants';
import type { Application } from '../../../shared/interfaces';

const group = (basket: ShowcaseItem[]) => {
  const grouped: Record<string, Record<string, number>> = {};

  basket.forEach((item) => {
    if (!grouped[item.parent]) grouped[item.parent] = {};
    grouped[item.parent][item.id] = item.qty;
  });

  return grouped;
};

const generateTgMessage = (basket: ShowcaseItem[]) => {
  const totalPrice = VNpricer.format(basket.reduce((acc, item) => acc + +item.qty * +item.price, 0) + DELIVERY_PRICE);

  const bill = basket
    .map(
      ({ title, price, qty }) => `${title}\n   ${qty} x ${VNpricer.format(+price)} = ${VNpricer.format(+qty * +price)}`,
    )
    .join('\n--------------------\n');

  return `\n----------------------------------------
    \nСпасибо, мы получили Ваш заказ!
    \n${bill}
    \n----------------------------------------
    \nДоставка: ${VNpricer.format(DELIVERY_PRICE)}
    \n----------------------------------------
    \nИтог: ${totalPrice}
    \n----------------------------------------
    \nНаш курьер свяжеться с вами в самое ближайшее время
    \nПо вопросу заказа можно связаться`;
};

export const useOrder = (onBasketClose: () => void) => {
  const { user, basket } = useStore($globalStore);

  const { tgQueryId } = useTelegram();

  const [loading, setLoading] = useState<boolean>(false);

  const toast = useToast();

  const onPlaceOrder = async () => {
    setLoading(true);

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
      })
      .finally(() => {
        if (!tgQueryId) {
          setLoading(false);
        }
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
            clientSupport: generateTgMessage(basket),
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
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return {
    loading,
    onPlaceOrder,
  };
};
