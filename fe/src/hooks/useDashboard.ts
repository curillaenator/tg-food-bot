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

  const { user: employeeUser } = useStore($globalStore);
  const { pickedApplications } = useStore($aplicationsStore);

  console.log(pickedApplications);

  const onAplicationPick = useCallback(
    async (application: Application) => {
      const employeeId = employeeUser?.id;

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
    [employeeUser],
  );

  // следит за принятыми заказами сотрудником
  useEffect(() => {
    if (!employeeUser?.id) return;

    const employeePickedApplsUnsub = onValue(ref(rtdb, `users/${employeeUser.id}/pickedApplications`), (snap) => {
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
  }, [employeeUser?.id]);

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
    employeeId: employeeUser?.id,
    orders,
    onAplicationPick,
    pickIsDisabled: pickedApplications.length >= LIMIT_PER_EMPLOYEE_APLICATIONS,
  };
};
