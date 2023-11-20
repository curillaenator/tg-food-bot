import { useState, useEffect, useCallback } from 'react';
import { useStore } from 'effector-react';
import { ref, get, child, onValue, update } from 'firebase/database';

import { rtdb } from '../shared/firebase';

import type { Application } from '../shared/interfaces';
import { $globalStore } from '../store';
import { $aplicationsStore, setPickedApplications } from '../store/applications';

import { LIMIT_PER_EMPLOYEE_APLICATIONS } from '../shared/constants';

export const useDashboard = () => {
  const [orders, setOrders] = useState<Application[]>([]);

  const { user: currentUser } = useStore($globalStore);
  const { pickedApplications } = useStore($aplicationsStore);

  const onAplicationPick = useCallback(
    async (application: Application) => {
      const employeeId = currentUser?.id;

      const updatedApplication: Application = {
        customer: application.customer,
        placed: application.placed,
        status: 'accepted',
        executor: employeeId || null,
        expectedTime: '30 мин',
        content: application.content,
      };

      const previouslyPickedApplications = await get(child(ref(rtdb), `users/${employeeId}/pickedApplications`)).then(
        (snap) => (snap.exists() ? snap.val() : {}) as Record<string, boolean>,
      );

      update(ref(rtdb), {
        [`orders/${application.id}`]: updatedApplication,
        [`users/${employeeId}/pickedApplications`]: { ...previouslyPickedApplications, [application.id]: true },
      });
    },
    [currentUser],
  );

  // следит за принятыми заказами сотрудником
  useEffect(() => {
    if (!currentUser?.id) return;

    const employeePickedApplsUnsub = onValue(ref(rtdb, `users/${currentUser.id}/pickedApplications`), (snap) => {
      if (snap.exists()) {
        const keyOfEmployeeAplications: string[] = [];

        snap.forEach((childSnap) => {
          keyOfEmployeeAplications.push(childSnap.key);
        });

        const employeeAplicationsPromises = keyOfEmployeeAplications.map((key) => {
          return get(child(ref(rtdb), `orders/${key}`)).then((snap) => snap.val() as Application);
        });

        Promise.all(employeeAplicationsPromises).then((resolvedApplications) => {
          setPickedApplications(resolvedApplications);
        });
      } else {
        setPickedApplications([]);
      }
    });

    return () => employeePickedApplsUnsub();
  }, [currentUser?.id]);

  // следит за заказами в базе
  useEffect(() => {
    const unsubscribeOrders = onValue(ref(rtdb, 'orders'), (snap) => {
      if (snap.exists()) {
        const orders = Object.entries(snap.val() as Record<string, Application>).map(([orderId, orderContent]) => {
          return {
            id: orderId,
            ...orderContent,
          };
        });

        setOrders(orders);
      }
    });

    return () => unsubscribeOrders();
  }, []);

  return {
    currentUser,
    orders,
    onAplicationPick,
    pickIsDisabled: pickedApplications.length >= LIMIT_PER_EMPLOYEE_APLICATIONS,
  };
};
