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
    formState: { errors, isSubmitting },
  } = useForm<OwnerFormState>({ defaultValues: INITIAL_STATE });

  const toast = useToast();

  const [ownersList, setOwnersList] = useState<OptionsOrGroups<Partial<User>, GroupBase<User>>>([]);
  const [servicesList, setServicesList] = useState<OptionsOrGroups<Partial<Service>, GroupBase<Service>>>([]);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);

    const getAsyncData = async () => {
      const serviceOwners =
        (await getDocs(collection(firedb, 'serviceOwners'))
          .then((serviceOwnersIds) =>
            serviceOwnersIds.docs.map(
              (doc) => ({ id: doc.id, label: doc.data().email, value: doc.id }) as Partial<User>,
            ),
          )
          .catch((err) => console.table(err))) || [];

      setOwnersList(serviceOwners);
      setValue('user', null);

      setLoading(false);
    };

    getAsyncData();
  }, [setValue]);

  useEffect(() => {
    if (!ownersList.length) return;

    setLoading(true);

    get(child(ref(rtdb), 'services'))
      .then((snap) => {
        const services = (snap.exists() ? snap.val() : {}) as Record<string, Service>;

        const servicesMaped = Object.entries(services).map(([srvcId, srvc]) => ({
          ...srvc,
          id: srvcId,
          label: srvc.title,
          value: srvcId,
        }));

        setServicesList(servicesMaped);

        setValue('serviceToOwn', null);
      })
      .catch((err) => console.table(err))
      .finally(() => setLoading(false));
  }, [ownersList, setValue]);

  const onSubmit = useCallback(async () => {
    setLoading(true);

    const { servicesOwned, user, serviceToOwn } = getValues();

    const combined = [...servicesOwned, serviceToOwn] as Service[];

    const updates = {
      [`users/${user.id}/ownerOf`]: Object.fromEntries(combined.map((item) => [item.id, true])),
    };

    await update(ref(rtdb), updates);

    setValue('serviceToOwn', null);

    setLoading(false);

    toast({
      title: 'Готово',
      description: 'Сервис привязан к пользователю',
      status: 'success',
      duration: TOAST_DURATION,
      isClosable: true,
    });
  }, [toast, setValue, getValues]);

  return {
    selectedUser: watch('user'),
    servicesOwned: watch('servicesOwned'),
    serviceToOwn: watch('serviceToOwn'),

    ownersList,
    servicesList,

    loading: loading || isSubmitting,
    control,
    errors,
    handleSubmit,
    register,
    onSubmit,
    setValue,
  };
};
