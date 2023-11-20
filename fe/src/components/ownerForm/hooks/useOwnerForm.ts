import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ref, child, update, get } from 'firebase/database';
import type { OptionsOrGroups, GroupBase } from 'chakra-react-select';

import { rtdb } from '../../../shared/firebase';

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

      await get(child(ref(rtdb), 'users'))
        .then((snap) => {
          if (!snap.exists()) return;

          const users = snap.val() as Record<string, User>;

          const usersMaped = Object.entries(users).map(([usrId, usr]) => ({
            ...usr,
            id: usrId,
            label: usr.email,
            value: usrId,
          }));

          setAllUsers(usersMaped);
          setValue('user', null);
        })
        .catch((err) => console.table(err));

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
  }, [setValue, getValues]);

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
