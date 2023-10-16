import React, { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from 'effector-react';
import {
  Flex,
  Spacer,
  Text,
  ButtonGroup,
  Button,
  Avatar,
  Stack,
  Image,
  Progress,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';

import { HamburgerIcon, ChevronLeftIcon } from '@chakra-ui/icons';

import { $globalStore } from '../../store';
import { useAuth } from '../../hooks/useAuth';

import { useOverlaysControl } from './hooks/useOverlaysControl';

import { Profile } from '../profile';
import { Basket } from '../basket';
import { SignForm } from '../signForm';
import { BasketIcon } from '../../assets/BasketIcon';

import pixpaxLogo from '../../assets/logo/pixpaxLogo.png';

export const UserSection: FC = () => {
  const { user, basket } = useStore($globalStore);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { isAuthOpen, isBasketOpen, onAuthOpen, onBasketOpen, onAuthClose, onBasketClose } = useOverlaysControl();

  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const { authLoading, firstTime, creds, onCredsChange, signOut, authAction, setFirstTime, resetPassword } = useAuth();

  const isHomePage = pathname === '/';

  return (
    <>
      <Flex as='header' p={4} alignItems='çenter' bg='blackAlpha.400'>
        {isHomePage ? (
          <Image src={pixpaxLogo} p={2.5} h={12} objectFit='cover' />
        ) : (
          <Button
            leftIcon={<ChevronLeftIcon boxSize={8} />}
            h='fit-content'
            variant='ghost'
            p={2}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        )}

        <Spacer />

        {!user?.id ? (
          <Button h='fit-content' variant='ghost' p={2} onClick={onAuthOpen}>
            <HamburgerIcon boxSize={8} />
          </Button>
        ) : (
          <Flex gap={2}>
            {!!basket.length && (
              <Button
                boxShadow='inset 0 0 0 2px var(--pixpax-colors-telegram-200)'
                bg='var(--pixpax-colors-whiteAlpha-200)'
                borderRadius='24px'
                variant='ghost'
                h='fit-content'
                py={2}
                px={4}
                onClick={onBasketOpen}
                leftIcon={<BasketIcon />}
              >
                {basket.length}
              </Button>
            )}
            <Avatar
              bg='telegram.200'
              color='gray.800'
              cursor='pointer'
              size='md'
              src={user?.avatar}
              name={user?.name}
              onClick={onAuthOpen}
            />
          </Flex>
        )}
      </Flex>

      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isAuthOpen} onClose={onAuthClose}>
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
                  onClick={onAuthClose}
                >
                  {!!user?.id ? 'Ok' : 'Close'}
                </Button>
              </ButtonGroup>
            </AlertDialogFooter>

            {authLoading && <Progress size='xs' isIndeterminate />}
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Basket isBasketOpen={isBasketOpen} onBasketClose={onBasketClose} />
    </>
  );
};
