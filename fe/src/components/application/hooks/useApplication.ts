import { useEffect, useState } from 'react';
import { ref, child, get } from 'firebase/database';

import { rtdb } from '../../../shared/firebase';

import type { EmergencyStatus } from '../interfaces';
import type { Application, User } from '../../../shared/interfaces';

import { getRelativeTime } from '../utils';

export const useApplication = (props: Application) => {
  const { customer, placed, executor } = props;

  const [customerUser, setCustomerUser] = useState<Partial<User> | null>(null);
  const [executorUser, setExecutorUser] = useState<Partial<User> | null>(null);
  const [emergency, setEmergency] = useState<EmergencyStatus>(null);

  useEffect(() => {
    get(child(ref(rtdb), `users/${customer}`)).then((snap) => {
      if (snap.exists()) setCustomerUser(snap.val());
    });
  }, [customer]);

  useEffect(() => {
    const diffSeconds = Math.abs(Math.round((+placed - Date.now()) / 1000));

    switch (true) {
      case diffSeconds > 60 * 40:
        setEmergency('fire');
        break;

      case diffSeconds > 60 * 20:
        setEmergency('warn');
        break;

      default:
        setEmergency('ok');
        break;
    }
  }, [placed]);

  useEffect(() => {
    get(child(ref(rtdb), `users/${executor}`)).then((snap) => {
      if (snap.exists()) setExecutorUser(snap.val());
    });
  }, [executor]);

  return {
    customerName: customerUser?.name,
    customeAdress: customerUser?.adress,
    customeTel: customerUser?.tel,
    executorName: executorUser?.name,
    executorId: executorUser?.id,
    placed: getRelativeTime(placed),
    emergency,
  };
};
