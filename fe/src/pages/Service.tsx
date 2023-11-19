import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'effector-react';

import { ref, get, child } from 'firebase/database';

import { Box, Progress, Accordion } from '@chakra-ui/react';

import { rtdb } from '../shared/firebase';
import { $globalStore, setEditor } from '../store';

import { ShowcaseSection, type Category } from '../components/ShowcaseSection';

// type ServiceItems = Record

export const ServicePage: FC = () => {
  const { user } = useStore($globalStore);
  const navigate = useNavigate();

  useEffect(() => {
    if (!!user?.id) return;
    navigate('/');
  }, [user, navigate]);

  const [services, setServices] = useState<Category[]>([]);
  const [servicesFull, setServicesFull] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);

    get(child(ref(rtdb), `users/${user.id}/ownerOf`)).then((snap) => {
      const response = (snap.exists() ? snap.val() : {}) as Record<string, boolean>;

      const sevicesWithItemIds = Object.keys(response);

      if (!sevicesWithItemIds.length) {
        setLoading(false);
        navigate('/');
      }

      const servicePromises = sevicesWithItemIds.map((serviceId) => {
        return get(child(ref(rtdb), `services/${serviceId}`)).then((snap) => {
          return (snap.exists() ? { ...snap.val(), id: serviceId } : {}) as Category;
        });
      });

      Promise.all(servicePromises).then((services) => setServices(services.filter((s) => !!Object.keys(s).length)));
    });
  }, [user, navigate]);

  useEffect(() => {
    const servicesWithItemsPromise = services.map(async (service) => {
      if (!service.categories) return service;

      const itemsPromises = Object.entries(service.categories)
        .filter(([itemId, isActive]) => !!itemId && isActive)
        .map(([itemId]) =>
          get(child(ref(rtdb), `items/${itemId}`)).then(
            (snap) => ({ id: itemId, ...(snap.exists() ? snap.val() : {}) }) as Category,
          ),
        );

      return Promise.all(itemsPromises).then((serviceItems) => ({ ...service, categories: serviceItems }));
    });

    Promise.all(servicesWithItemsPromise).then((services) => {
      setServicesFull(services);

      setLoading(false);
    });
  }, [services]);

  console.log(servicesFull);

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
          <ShowcaseSection key={service.id} {...service} />
        ))}
      </Accordion>
    </Box>
  );
};
