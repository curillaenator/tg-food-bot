import React, { FC, ChangeEvent } from 'react';
import parse from 'html-react-parser';
import { ref, set } from 'firebase/database';

import { InputGroup, Textarea, Text } from '@chakra-ui/react';

import { rtdb } from '../../../shared/firebase';
import { debounced } from '../../../utils';

const onEditDescription = (e: ChangeEvent<HTMLTextAreaElement>, serviceId: string) => {
  const value = e.target.value.replace(/\n/g, '<br />');
  set(ref(rtdb, `services/${serviceId}/description`), value);
};

const onEditValueDebounced = debounced(onEditDescription, 1500);

interface ServiceDescriptionProps {
  serviceId: string;
  description: string;
  isEditor: boolean;
}

export const ServiceDescription: FC<ServiceDescriptionProps> = (props) => {
  const { serviceId, description, isEditor } = props;

  if (isEditor)
    return (
      <>
        <Text fontSize='xs' color='chakra-subtle-text'>
          Изменить описание сервиса:
        </Text>

        <InputGroup size='sm' flexDirection='column' gap='4px'>
          <Textarea
            placeholder='Description'
            defaultValue={description.replace(/<br \/>/g, '\n')}
            onChange={(e) => onEditValueDebounced(e, serviceId)}
            resize='none'
            rows={12}
          />
        </InputGroup>
      </>
    );

  return (
    <Text fontSize='xs' color='chakra-subtle-text'>
      {parse(description)}
    </Text>
  );
};
