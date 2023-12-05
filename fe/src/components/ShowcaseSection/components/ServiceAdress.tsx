import React, { FC, ChangeEvent } from 'react';
// import { useStore } from 'effector-react';
import { ref, set } from 'firebase/database';

import { Input, Text, InputGroup } from '@chakra-ui/react';

// import { $globalStore } from '../../../store';
import { rtdb } from '../../../shared/firebase';
import { debounced } from '../../../utils';

const onEditAdress = (e: ChangeEvent<HTMLInputElement>, serviceId: string) => {
  const value = e.target.value.replace(/\n/g, '<br />');
  set(ref(rtdb, `services/${serviceId}/adress`), value);
};

const onEditValueDebounced = debounced(onEditAdress, 1500);

interface ServiceAdressProps {
  serviceId: string;
  adress: string;
  isEditor: boolean;
}

export const ServiceAdress: FC<ServiceAdressProps> = (props) => {
  const { serviceId, adress, isEditor } = props;

  // const { , user } = useStore($globalStore);
  // const canBeShown = user?.role === 'admin' || user?.role === 'manager';

  if (!isEditor) return null;

  return (
    <>
      <Text fontSize='xs' color='chakra-subtle-text'>
        Изменить адрес сервиса:
      </Text>

      <InputGroup size='sm'>
        <Input
          id={`adress-of-${serviceId}`}
          autoComplete='off'
          defaultValue={adress}
          onChange={(e) => onEditValueDebounced(e, serviceId)}
          placeholder='Скопируй из GoogleMaps'
        />
      </InputGroup>
    </>
  );
};
