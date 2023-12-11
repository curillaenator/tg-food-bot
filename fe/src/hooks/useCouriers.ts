import { useState, useEffect, useCallback } from 'react';
import { ref, set, get } from 'firebase/database';
import { doc, setDoc, collection, query, deleteDoc, onSnapshot } from 'firebase/firestore';

import { useToast } from '@chakra-ui/react';

import { User } from '../shared/interfaces';
import { TOAST_DURATION } from '../shared/constants';

import { rtdb, firedb } from '../shared/firebase';

type FireDBCourier = Pick<User, 'id' | 'email' | 'name' | 'tel' | 'tme'>;

export const useCouriers = () => {
  const [courierList, setCourierList] = useState<FireDBCourier[]>([]);
  const [courierId, setCourierId] = useState<string>('');

  const toast = useToast();

  const addCourier = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      get(ref(rtdb, `users/${courierId}`)).then(async (snap) => {
        if (!snap.exists() || !!snap.val()?.isAnon) {
          toast({
            title: 'Ошибка',
            description: 'Нет такого пользователя',
            status: 'error',
            duration: TOAST_DURATION,
            isClosable: true,
          });

          return;
        }

        const { id, email, name, tme, tel } = snap.val() as User;

        await set(ref(rtdb, `users/${courierId}/role`), 'employee');

        await setDoc(doc(firedb, 'couriers', courierId), {
          id,
          email,
          name: name || '',
          tme: tme || '',
          tel: tel || '',
        });

        toast({
          title: 'Готово',
          description: 'Курьер добавлен',
          status: 'success',
          duration: TOAST_DURATION,
          isClosable: true,
        });
      });
    },
    [courierId, toast],
  );

  const fireCourier = useCallback(
    async (courierId: string) => {
      if (!confirm('Точно?')) return;

      await set(ref(rtdb, `users/${courierId}/role`), 'pixpax');

      await deleteDoc(doc(firedb, 'couriers', courierId));

      toast({
        title: 'Готово',
        description: 'Курьер уволен',
        status: 'info',
        duration: TOAST_DURATION,
        isClosable: true,
      });
    },
    [toast],
  );

  useEffect(() => {
    const couriersQuery = query(collection(firedb, 'couriers'));

    const unsub = onSnapshot(couriersQuery, (snap) => {
      const employedCouriers: FireDBCourier[] = [];
      snap.forEach((doc) => employedCouriers.push(doc.data() as FireDBCourier));
      setCourierList(employedCouriers);
    });

    return () => unsub();
  }, []);

  return {
    courierId,
    courierList,
    fireCourier,
    setCourierId,
    addCourier,
  };
};
