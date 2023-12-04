import React, { FC } from 'react';

import { Text, InputGroup, Input, InputLeftAddon, Stack } from '@chakra-ui/react';

import { StarIcon, PhoneIcon, EditIcon } from '@chakra-ui/icons';

import { updateUser } from '../../store';

import { useProfile } from '../../hooks/useProfile';

export const Profile: FC = () => {
  const { name = '', adress = '', tel = '' } = useProfile();

  return (
    <Stack w='100%' flexDirection='column' gap={4}>
      <Text fontSize='sm' color='chakra-subtle-text'>
        Как вас зовут?
      </Text>
      <InputGroup>
        <InputLeftAddon
          children={<StarIcon boxSize={4} />} // eslint-disable-line react/no-children-prop
        />
        <Input
          autoComplete='off'
          placeholder='коротко и ясно'
          type='text'
          size='md'
          value={name}
          onChange={(e) => updateUser({ name: e.target.value })}
        />
      </InputGroup>

      <Text fontSize='sm' color='chakra-subtle-text'>
        Укажите свой адрес доставки. Наши курьеры связываются с вами при заказе чтобы его уточнить, но чем точнее
        укажите - тем быстрее все привезем!
      </Text>

      <InputGroup>
        <InputLeftAddon
          children={<EditIcon boxSize={4} />} // eslint-disable-line react/no-children-prop
        />
        <Input
          autoComplete='off'
          placeholder='Адресс доставки'
          type='text'
          size='md'
          value={adress}
          onChange={(e) => updateUser({ adress: e.target.value })}
        />
      </InputGroup>

      <Text fontSize='sm' color='chakra-subtle-text'>
        Укажите любой удобный вам контакт, чтобы наши курьеры смогли связаться с вами
      </Text>

      <InputGroup>
        <InputLeftAddon
          children={<PhoneIcon boxSize={4} />} // eslint-disable-line react/no-children-prop
        />
        <Input
          autoComplete='off'
          placeholder='+84... или +7().... или t.me/...'
          type='text'
          size='md'
          value={tel}
          onChange={(e) => updateUser({ tel: e.target.value })}
        />
      </InputGroup>
    </Stack>
  );
};
