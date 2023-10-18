import React, { FC } from 'react';

import {
  // Flex,
  // Spacer,
  // Text,
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
      <InputGroup>
        <InputLeftAddon
          h={12}
          children={<StarIcon boxSize={4} />} // eslint-disable-line react/no-children-prop
        />
        <Input
          autoComplete='off'
          placeholder='My name'
          type='text'
          size='lg'
          value={name}
          onChange={(e) => updateUser({ name: e.target.value })}
        />
      </InputGroup>

      <InputGroup>
        <InputLeftAddon
          h={12}
          children={<EditIcon boxSize={4} />} // eslint-disable-line react/no-children-prop
        />
        <Input
          autoComplete='off'
          placeholder='My delivery adress'
          type='text'
          size='lg'
          value={adress}
          onChange={(e) => updateUser({ adress: e.target.value })}
        />
      </InputGroup>

      {/* <InputGroup>
        <InputLeftAddon
          h={12}
          children={<AtSignIcon boxSize={4} />} // eslint-disable-line react/no-children-prop
        />
        <Input autoComplete='off' placeholder='t.me/...' type='text' size='lg' value={''} onChange={(e) => {}} />
      </InputGroup> */}

      <InputGroup>
        <InputLeftAddon
          h={12}
          children={<PhoneIcon boxSize={4} />} // eslint-disable-line react/no-children-prop
        />
        <Input
          autoComplete='off'
          placeholder='My phone'
          type='number'
          size='lg'
          value={tel}
          onChange={(e) => updateUser({ tel: e.target.value })}
        />
      </InputGroup>
    </Stack>
  );
};
