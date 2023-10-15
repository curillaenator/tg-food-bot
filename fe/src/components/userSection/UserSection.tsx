import React, { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from 'effector-react';
import {
  Flex,
  Spacer,
  Text,
  ButtonGroup,
  Button,
  Heading,
  Avatar,
  Stack,
  Progress,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';

import { HamburgerIcon, ChevronLeftIcon } from '@chakra-ui/icons';

import { $globalStore } from '../../store';
import { useAuth } from '../../hooks/useAuth';

import { Profile } from '../profile';
import { SignForm } from '../signForm';
import { BasketIcon } from './BasketIcon';

export const UserSection: FC = () => {
  const { user, basket } = useStore($globalStore);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const { authLoading, firstTime, creds, onCredsChange, signOut, authAction, setFirstTime, resetPassword } = useAuth();

  const isHomePage = pathname === '/';

  return (
    <>
      <Flex as='header' p={4} alignItems='çenter' bg='blackAlpha.400'>
        {isHomePage ? (
          <Heading transform='translateY(-3px)' fontSize='4xl'>
            Pixpax
          </Heading>
        ) : (
          <Button h='fit-content' variant='ghost' p={2} onClick={() => navigate(-1)}>
            <ChevronLeftIcon boxSize={8} />
            <Text>Back</Text>
          </Button>
        )}

        <Spacer />

        {!user?.id ? (
          <Button h='fit-content' variant='ghost' p={2} onClick={onOpen}>
            <HamburgerIcon boxSize={8} />
          </Button>
        ) : (
          <Stack flexDirection='row' gap={2}>
            {!!basket.length && (
              <Button
                boxShadow='inset 0 0 0 2px var(--pixpax-colors-telegram-200)'
                bg='var(--pixpax-colors-whiteAlpha-200)'
                borderRadius='50%'
                variant='ghost'
                h='fit-content'
                p={2}
              >
                <BasketIcon />
              </Button>
            )}
            <Avatar
              bg='telegram.200'
              color='gray.800'
              cursor='pointer'
              size='md'
              src={user?.avatar}
              name={user?.name}
              onClick={onOpen}
            />
          </Stack>
        )}
      </Flex>

      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent p={4} display='flex' flexDirection='column' gap={4}>
            <AlertDialogHeader fontSize='3xl' fontWeight='bold' textAlign='center'>
              <Stack flexDirection='row' alignItems='center' justifyContent='space-between'>
                {!!user?.id && (
                  <Button color='whiteAlpha.500' size='xs' variant='ghost' onClick={signOut}>
                    Logout
                  </Button>
                )}

                <Text>{!!user?.id ? 'Profile' : 'Sign in'}</Text>
              </Stack>
            </AlertDialogHeader>

            <AlertDialogBody>
              {!!user?.id ? (
                <Profile />
              ) : (
                <SignForm
                  authLoading={authLoading}
                  firstTime={firstTime}
                  creds={creds}
                  onCredsChange={onCredsChange}
                  resetPassword={resetPassword}
                  setFirstTime={setFirstTime}
                />
              )}
            </AlertDialogBody>

            <AlertDialogFooter justifyContent='center'>
              <ButtonGroup width='100%' isAttached size='lg' display='flex' justifyContent='center'>
                {!user?.id && (
                  <Button
                    p={4}
                    width='100%'
                    variant='solid'
                    colorScheme='telegram'
                    h='fit-content'
                    isDisabled={authLoading}
                    onClick={authAction}
                  >
                    {firstTime ? 'Sign in' : 'Go!'}
                  </Button>
                )}

                <Button
                  p={4}
                  width='100%'
                  variant={!!user?.id ? 'solid' : 'outline'}
                  colorScheme={!!user?.id ? 'telegram' : undefined}
                  color={!!user?.id ? undefined : 'chakra-subtle-text'}
                  h='fit-content'
                  ref={cancelRef}
                  isDisabled={authLoading}
                  onClick={onClose}
                >
                  {!!user?.id ? 'Ok' : 'Close'}
                </Button>
              </ButtonGroup>
            </AlertDialogFooter>

            {authLoading && <Progress size='xs' isIndeterminate />}
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
