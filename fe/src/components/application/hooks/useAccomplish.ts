import { useCallback, useState } from 'react';
import { useToast } from '@chakra-ui/react';

import { ref, update } from 'firebase/database';
import { doc, setDoc } from 'firebase/firestore';

import { firedb, rtdb } from '../../../shared/firebase';
import { TOAST_DURATION } from '../../../shared/constants';

import type { FullShowcaseItem } from '../interfaces';

interface AccomplishOptions {
  id: string;
  details: FullShowcaseItem[];
  customer: {
    name: string;
    adress: string;
    tel: string;
    tme: string;
  };
  executorId: string;
  totalApplicationPrice: number;
  payed: string;
}

export const useAccomplish = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const toast = useToast();

  const accomplish = useCallback(
    async (options: AccomplishOptions) => {
      if (!confirm('Точно?')) return;

      setLoading(true);

      const { id, details, payed, ...rest } = options;
      const today = new Date();

      await setDoc(doc(firedb, 'orders', String(today.getFullYear()), String(today.getMonth()), id), {
        id,
        status: !payed ? 'canceled' : 'confirmed',
        details: Object.fromEntries(details.map((record) => [record.id, record])),
        payed,
        ...rest,
      }).catch(() => setLoading(false));

      await update(ref(rtdb), {
        [`orders/${id}`]: null,
        [`users/${rest.executorId}/pickedApplications/${id}`]: null,
      }).catch(() => setLoading(false));

      setLoading(false);

      if (!payed || +payed <= 0) {
        toast({ title: 'Заявка отменена', status: 'warning', duration: TOAST_DURATION, isClosable: true });
      } else {
        toast({ title: 'Заявка завершена', status: 'success', duration: TOAST_DURATION, isClosable: true });
      }
    },
    [toast],
  );

  return {
    loading,
    accomplish,
  };
};
