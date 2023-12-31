import { useEffect, useState } from 'react';

import { ref, child, get } from 'firebase/database';
import { rtdb } from '../../../shared/firebase';

import type { UseDetailesProps, FullShowcaseItem } from '../interfaces';
import type { Item } from '../../../shared/interfaces';

export const useDetailes = (props: UseDetailesProps) => {
  const { content, currentUserId, executorId } = props;

  const [details, setDetails] = useState<FullShowcaseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (currentUserId !== executorId) {
      setLoading(false);
      return;
    }

    const detailesPromises = Object.entries(content).map(async ([serviceId, qtyByItemId]) => {
      const orderItemsPromises = Object.entries(qtyByItemId).map(([itemId, qty]) =>
        get(child(ref(rtdb), `items/${itemId}`)).then((snap) => ({
          ...((snap.val() as Item) || {}),
          id: itemId,
          qty: String(qty),
        })),
      );

      const orderItems = await Promise.all(orderItemsPromises);

      return await get(child(ref(rtdb), `services/${serviceId}`)).then((snap) => ({
        ...((snap.val() as FullShowcaseItem) || {}),
        id: serviceId,
        totalServicePrice: orderItems.reduce((acc, item) => acc + +item.price * +item.qty, 0),
        order: orderItems,
      }));
    });

    Promise.all(detailesPromises).then((res) => {
      // @ts-expect-error типизация выровнена
      setDetails(res);
      setLoading(false);
    });
  }, [currentUserId, executorId, content]);

  return {
    loading,
    details: details,
    totalApplicationPrice: details.reduce((acc, service) => acc + +service.totalServicePrice, 0),
  };
};
