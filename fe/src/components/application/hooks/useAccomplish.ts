import { useCallback, useState } from 'react';

import { ref, update } from 'firebase/database';
import { doc, setDoc } from 'firebase/firestore';

import { firedb, rtdb } from '../../../shared/firebase';

import type { FullShowcaseItem } from '../interfaces';

interface AccomplishOptions {
  id: string;
  details: FullShowcaseItem[];
  customerName: string;
  customerAdress: string;
  customerTel: string;
  executorId: string;
  totalApplicationPrice: number;
}

export const useAccomplish = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const accomplish = useCallback(async (options: AccomplishOptions) => {
    const { id, ...rest } = options;

    setLoading(true);

    const today = new Date();

    await setDoc(doc(firedb, 'orders', String(today.getFullYear()), String(today.getMonth()), id), {
      id,
      ...rest,
    }).catch(() => setLoading(false));

    await update(ref(rtdb), {
      [`orders/${id}`]: null,
      [`users/${rest.executorId}/pickedApplications/${id}`]: null,
    }).catch(() => setLoading(false));

    setLoading(false);
  }, []);

  return {
    loading,
    accomplish,
  };
};
