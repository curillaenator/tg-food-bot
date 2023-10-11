import React, { FC } from 'react';
import { Flex, Spacer, Text, Button, Icon, Heading } from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';

import type { HeaderProps } from './interfaces';

export const Header: FC<HeaderProps> = (props) => {
  return (
    <Flex p='2'>
      <Heading fontSize='3xl' color='telegram.500' lineHeight='8'>
        Pixpax
      </Heading>

      <Spacer />

      <Button colorScheme='telegram' variant='ghost'>
        <Icon as={SettingsIcon} boxSize={8} />
      </Button>
    </Flex>
  );
};
