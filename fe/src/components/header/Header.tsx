import React, { FC } from 'react';
import { useStore } from 'effector-react';
import {
  Flex,
  Spacer,
  // Text,
  // Icon,
  ButtonGroup,
  Button,
  Heading,
  Avatar,
  // Stack,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  // AlertDialogCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';

import { $globalStore } from '../../store';

// import { AppleIcon } from './assets/AppleIcon';
import { GoogleIcon } from './assets/GoogleIcon';

import type { HeaderProps } from './interfaces';

export const Header: FC<HeaderProps> = ({ authWith, signOut }) => {
  const { google } = authWith;
  const { user } = useStore($globalStore);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <Flex p='4'>
        <Heading fontSize='3xl' lineHeight='8'>
          Pixpax
        </Heading>

        <Spacer />

        {!user?.id ? (
          <Button variant='ghost' px={0} onClick={onOpen}>
            <InfoOutlineIcon boxSize={8} />
          </Button>
        ) : (
          <Avatar size='md' src={user?.avatar} name={user?.name} onClick={onOpen} />
        )}
      </Flex>

      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent p={4} display='flex' flexDirection='column' gap={8}>
            <AlertDialogHeader fontSize='3xl' fontWeight='bold' textAlign='center'>
              {!!user?.id ? `Привет ${user.name}` : 'Sign in with:'}
            </AlertDialogHeader>

            <AlertDialogBody>
              {!!user?.id ? (
                <Button color='chakra-subtle-text' size='lg' variant='ghost' onClick={signOut}>
                  Sign out
                </Button>
              ) : (
                <ButtonGroup isAttached variant='outline' size='lg' display='flex' justifyContent='center'>
                  <Button p={4} h='fit-content' onClick={google}>
                    <GoogleIcon />
                  </Button>

                  {/* <Button p={4} h='fit-content' onClick={apple}>
                    <AppleIcon />
                  </Button> */}
                </ButtonGroup>
              )}
            </AlertDialogBody>

            <AlertDialogFooter justifyContent='center'>
              <Button color='chakra-subtle-text' size='lg' ref={cancelRef} variant='ghost' onClick={onClose}>
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
