import React, { FC } from 'react';

import {
  // Flex,
  // Spacer,
  Text,
  // ButtonGroup,
  // Checkbox,
  // Button,
  InputGroup,
  Input,
  InputLeftAddon,
  // InputLeftElement,
  // InputRightElement,
  // Heading,
  Stack,
} from '@chakra-ui/react';

import {
  StarIcon,
  // AtSignIcon,
  PhoneIcon,
  EditIcon,
} from '@chakra-ui/icons';

import { updateUser } from '../../store';

import { useProfile } from '../../hooks/useProfile';

export const Profile: FC = () => {
  const {
    // id,
    name = '',
    adress = '',
    //  avatar,
    tel = '',
  } = useProfile();

  return (
    <Stack w='100%' flexDirection='column' gap={4}>
      <Text fontSize='sm' color='chakra-subtle-text'>
        Как вас зовут?
      </Text>
      <InputGroup>
        <InputLeftAddon
          h={12}
          children={<StarIcon boxSize={4} />} // eslint-disable-line react/no-children-prop
        />
        <Input
          autoComplete='off'
          placeholder='коротко и ясно'
          type='text'
          size='lg'
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
          h={12}
          children={<EditIcon boxSize={4} />} // eslint-disable-line react/no-children-prop
        />
        <Input
          autoComplete='off'
          placeholder='Адресс доставки'
          type='text'
          size='lg'
          value={adress}
          onChange={(e) => updateUser({ adress: e.target.value })}
        />
      </InputGroup>

      <Text fontSize='sm' color='chakra-subtle-text'>
        Укажите любой удобный вам контакт, чтобы наши курьеры смогли связаться с вами
      </Text>

      <InputGroup>
        <InputLeftAddon
          h={12}
          children={<PhoneIcon boxSize={4} />} // eslint-disable-line react/no-children-prop
        />
        <Input
          autoComplete='off'
          placeholder='+84... или +7().... или t.me/...'
          type='text'
          size='lg'
          value={tel}
          onChange={(e) => updateUser({ tel: e.target.value })}
        />
      </InputGroup>
    </Stack>
  );
};
