import React, { FC, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'effector-react';

import { ref, get, child, push, update } from 'firebase/database';

import { Box, Progress, Accordion, useToast } from '@chakra-ui/react';

import { rtdb } from '../shared/firebase';
import { debounced } from '../utils';
import { $globalStore, setEditor } from '../store';

import { ShowcaseSection } from '../components/ShowcaseSection';

import { TOAST_DURATION } from '../shared/constants';
import type { Service, Item } from '../shared/interfaces';

export const ServicePage: FC = () => {
  const { user: currentUser } = useStore($globalStore);
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [servicesFull, setServicesFull] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // lets user visit page
  useEffect(() => {
    const isManager = currentUser?.role === 'admin' || currentUser?.role === 'manager';
    const isServiceOwner = !!Object.keys(currentUser?.ownerOf || {}).length;

    const pageIsAvalable = isManager || isServiceOwner;
    if (pageIsAvalable) return;

    navigate('/');
  }, [services, currentUser, navigate]);

  const onMenuAddItem = useCallback(
    async (serviceId: string) => {
      const newPostKey = await push(child(ref(rtdb), 'items')).key;

      const menuItem: Omit<Item, 'id' | 'qty'> = {
        title: '',
        description: '',
        price: 10000,
        type: 'item',
        parent: serviceId,
        imgPath: `items/${newPostKey}`,
      };

      const updates = {
        [`items/${newPostKey}`]: menuItem,
        [`services/${serviceId}/categories/${newPostKey}`]: true,
      };

      await update(ref(rtdb), updates);

      const serviceIndex = servicesFull.findIndex((srvc) => srvc.id === serviceId);

      const targetService = { ...servicesFull[serviceIndex] };

      targetService.categories = [
        ...targetService.categories,
        {
          ...menuItem,
          id: newPostKey,
        },
      ];

      const updatedServicesFull = [...servicesFull];
      updatedServicesFull.splice(serviceIndex, 1, targetService);

      setServicesFull(updatedServicesFull);
    },
    [servicesFull],
  );

  const onMenuItemRemove = useCallback(
    (serviceId: string, itemId: string) => {
      const serviceIndex = servicesFull.findIndex((srvc) => srvc.id === serviceId);

      const targetService = { ...servicesFull[serviceIndex] };

      targetService.categories = targetService.categories.filter((item) => item.id !== itemId);

      const updatedServicesFull = [...servicesFull];
      updatedServicesFull.splice(serviceIndex, 1, targetService);

      setServicesFull(updatedServicesFull);
    },
    [servicesFull],
  );

  const toast = useToast();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedToast = useCallback(debounced(toast, 2000), [toast]);

  // get all owned sevices data by ids
  useEffect(() => {
    if (!currentUser?.id) return;

    const getOwnedServicesAsync = async () => {
      setLoading(true);

      const ownerOfsnap = await get(child(ref(rtdb), `users/${currentUser.id}/ownerOf`)); // ownerOf - bad prop naming
      const data = (ownerOfsnap.exists() ? ownerOfsnap.val() : {}) as Record<string, boolean>;
      const ownerOfSevicesIds = Object.keys(data);

      if (!ownerOfSevicesIds.length) {
        setLoading(false);
        return;
      }

      const servicePromises = ownerOfSevicesIds.map(async (serviceId) => {
        const serviceSnap = await get(child(ref(rtdb), `services/${serviceId}`));

        return (serviceSnap.exists() ? { ...serviceSnap.val(), id: serviceId } : {}) as Service;
      });

      const resolvedServices = await Promise.all(servicePromises);

      const filteredServices = resolvedServices.filter((srvc) => !!Object.keys(srvc).length);

      setServices(filteredServices);
    };

    getOwnedServicesAsync();

    debouncedToast({
      title: 'Важно',
      description:
        'На данной странице работает автосохранение! Любые изменения в полях форм будут автоматически сохранены в течении 3-5 сек после ввода данных',
      status: 'warning',
      duration: TOAST_DURATION * 4,
      isClosable: true,
    });
  }, [currentUser, debouncedToast]);

  // fill owned services by full data (products details)
  useEffect(() => {
    const servicesWithItemsPromise = services.map(async (service) => {
      if (!service.categories) return service;

      const itemsPromises = Object.entries(service.categories)
        // .filter(([itemId, isActive]) => !!itemId && isActive)
        .map(([itemId, isActive]) =>
          get(child(ref(rtdb), `items/${itemId}`)).then(
            (snap) => ({ id: itemId, isActive, ...(snap.exists() ? snap.val() : {}) }) as Item,
          ),
        );

      return Promise.all(itemsPromises).then((serviceItems) => ({ ...service, categories: serviceItems }));
    });

    Promise.all(servicesWithItemsPromise).then((services) => {
      setServicesFull(services);

      setLoading(false);
    });
  }, [services]);

  // enables editorMode when pathname is /service, i.e. this page
  useEffect(() => {
    setEditor(true);

    return () => {
      setEditor(false);
    };
  }, []);

  return (
    <Box as='main'>
      {loading && <Progress isIndeterminate size='xs' />}

      <Accordion allowMultiple defaultIndex={[0, 1, 2, 3, 4, 5, 6, 7]}>
        {servicesFull.map((service) => (
          <ShowcaseSection
            {...service}
            key={service.id}
            onMenuAdd={onMenuAddItem}
            onMenuItemRemove={onMenuItemRemove}
          />
        ))}
      </Accordion>
    </Box>
  );
};
