import { useEffect, useState } from 'react';

import { ref, child, get } from 'firebase/database';
import { rtdb } from '../../../shared/firebase';

import type { ShowcaseItem } from '../../../store';

type FullShowcaseItem = ShowcaseItem & { id: string; totalServicePrice: string; order: ShowcaseItem };

export const useDetailes = (currentUserId, executorId, content) => {
  const [detailes, setDetailes] = useState<Record<string, FullShowcaseItem | null>>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentUserId !== executorId) return;

    setLoading(true);

    const detailesPromises = Object.entries(content).map(async ([serviceId, qtyByItemId]) => {
      const orderItemsPromises = Object.entries(qtyByItemId).map(([itemId, qty]) => {
        return get(child(ref(rtdb), `items/${itemId}`)).then((snap) => {
          const data = snap.val() as ShowcaseItem;

          return {
            ...data,
            id: itemId,
            qty: String(qty),
            totalServicePrice: String(+data.price * +qty),
          } as unknown as FullShowcaseItem;
        });
      });

      const orderItems = await Promise.all(orderItemsPromises);

      return (await get(child(ref(rtdb), `services/${serviceId}`)).then((snap) => {
        return { id: serviceId, ...snap.val(), order: orderItems };
      })) as Record<string, FullShowcaseItem>;
    });

    Promise.all(detailesPromises).then((res) => {
      // @ts-expect-error TODO проверить типизацию
      setDetailes(res);
      setLoading(false);
    });
  }, [currentUserId, executorId, content]);

  const totalApplicationPrice = !detailes
    ? 0
    : Object.entries(detailes).reduce((acc, service) => {
        // @ts-expect-error TODO проверить типизацию
        return acc + service[1].order.reduce((itemAcc, { qty, price }) => itemAcc + +qty * +price, 0);
      }, 0);

  return {
    loading,
    detailes,
    totalApplicationPrice,
  };
};
