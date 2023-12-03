import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@chakra-ui/react';
import type { OptionsOrGroups, GroupBase } from 'chakra-react-select';

import { ref, child, update, get } from 'firebase/database';
import { collection, getDocs } from 'firebase/firestore';

import { rtdb, firedb } from '../../../shared/firebase';
import { TOAST_DURATION } from '../../../shared/constants';

import type { User, Category as Service } from '../../../shared/interfaces';

import type { OwnerFormState } from '../interfaces';

const INITIAL_STATE: OwnerFormState = {
  user: {},

  serviceToOwn: {},

  servicesOwned: [],
};

export const useOwnerForm = () => {
  const {
    watch,
    getValues,
    setValue,
    control,
    handleSubmit,
    register,
    // reset,
    formState: { errors, isSubmitting },
  } = useForm<OwnerFormState>({ defaultValues: INITIAL_STATE });

  const toast = useToast();

  const [allUsers, setAllUsers] = useState<OptionsOrGroups<Partial<User>, GroupBase<User>>>([]);
  const [allServices, setAllServices] = useState<OptionsOrGroups<Partial<Service>, GroupBase<Service>>>([]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);

    const getAsyncData = async () => {
      await get(child(ref(rtdb), 'services'))
        .then((snap) => {
          if (!snap.exists()) return;

          const services = snap.val() as Record<string, Service>;

          const servicesMaped = Object.entries(services).map(([srvcId, srvc]) => ({
            ...srvc,
            id: srvcId,
            label: srvc.title,
            value: srvcId,
          }));

          setAllServices(servicesMaped);
          setValue('serviceToOwn', null);
        })
        .catch((err) => console.table(err));

      const serviceOwners =
        (await getDocs(collection(firedb, 'serviceOwners'))
          .then((serviceOwnersIds) =>
            serviceOwnersIds.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as Partial<User>),
          )
          .catch((err) => console.table(err))) || [];

      const ownersWithServices = serviceOwners.map(
        async (usr) =>
          ({
            ...usr,
            label: usr.email,
            ownerOf: await get(ref(rtdb, `users/${usr.id}/ownerOf`))
              .then((snap) => ({
                ...((snap.exists() ? snap.val() : {}) as Record<string, boolean>),
              }))
              .catch((err) => console.table(err)),
          }) as Partial<User>,
      );

      await Promise.all(ownersWithServices).then((ownersList) => setAllUsers(ownersList));

      setValue('user', null);
      setLoading(false);
    };

    getAsyncData();
  }, [setValue]);

  const onSubmit = useCallback(async () => {
    setLoading(true);

    const { servicesOwned, user, serviceToOwn } = getValues();

    const combined = [...servicesOwned, serviceToOwn];

    const updates = {
      [`users/${user.id}/ownerOf`]: Object.fromEntries(combined.map((item) => [item.id, true])),
    };

    await update(ref(rtdb), updates);

    // @ts-expect-error types
    setValue('servicesOwned', combined);
    setValue('serviceToOwn', null);

    setLoading(false);

    toast({
      title: 'Готово',
      description: 'Сервис привязан к пользователю. ВАЖНО ОБНОВИТЬ СТРАНИЦУ !!!',
      status: 'success',
      duration: TOAST_DURATION * 3,
      isClosable: true,
    });
  }, [toast, setValue, getValues]);

  const attachedServices = watch('servicesOwned');
  const selectedUser = watch('user');

  const attachedIds = attachedServices.map((item) => item.id);

  return {
    selectedUser,
    attachedServices,
    allUsers,
    allServices: allServices.filter((item) => {
      // @ts-expect-error types
      return !attachedIds.includes(item.id);
    }),
    loading: loading || isSubmitting,
    control,
    errors,
    handleSubmit,
    register,
    onSubmit,
    setValue,
  };
};
