import React, { FC, useState } from 'react';
import { useStore } from 'effector-react';
import {
  Flex,
  Spacer,
  Text,
  ButtonGroup,
  Checkbox,
  Button,
  InputGroup,
  Input,
  InputLeftAddon,
  InputRightElement,
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

import { HamburgerIcon, EmailIcon, UnlockIcon } from '@chakra-ui/icons';

import { $globalStore } from '../../store';
import { useAuth } from '../../hooks/useAuth';

import { Profile } from '../profile';
import { BasketIcon } from './BasketIcon';

interface ErrorTextProps {
  error: string;
  resetPassword: () => void;
}

const ErrorText: FC<ErrorTextProps> = ({ error, resetPassword }) => (
  <Stack w='100%' flexDirection='column' gap={4}>
    <Text w='100%' textAlign='center' color='red.500'>
      {error}
    </Text>

    {error.includes('email-already-in-use') && <Button onClick={() => resetPassword()}>Remind password</Button>}
  </Stack>
);

export const UserSection: FC = () => {
  const { user, basket } = useStore($globalStore);

  const { authLoading, firstTime, creds, onCredsChange, signOut, authAction, setFirstTime, resetPassword } = useAuth();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [showPass, setShowPass] = useState<boolean>(false);

  return (
    <>
      <Flex p={4} alignItems='çenter'>
        <Heading transform='translateY(-3px)' fontSize='4xl'>
          Pixpax
        </Heading>

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
            <Avatar cursor='pointer' size='md' src={user?.avatar} name={user?.name} onClick={onOpen} />
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
                <Stack spacing={4}>
                  <InputGroup>
                    <InputLeftAddon
                      h={12}
                      children={<EmailIcon boxSize={4} />} // eslint-disable-line react/no-children-prop
                    />

                    <Input
                      isDisabled={authLoading}
                      autoComplete='off'
                      placeholder='Email'
                      type='email'
                      size='lg'
                      value={creds.email}
                      onChange={(e) => onCredsChange({ type: 'email', payload: e.target.value })}
                    />
                  </InputGroup>

                  <InputGroup>
                    <InputLeftAddon
                      h={12}
                      children={<UnlockIcon boxSize={4} />} // eslint-disable-line react/no-children-prop
                    />

                    <Input
                      isDisabled={authLoading}
                      autoComplete='off'
                      placeholder='Password'
                      type={showPass ? 'text' : 'password'}
                      size='lg'
                      value={creds.password}
                      onChange={(e) => onCredsChange({ type: 'password', payload: e.target.value })}
                    />

                    <InputRightElement h='100%' display='flex' alignItems='center' width='4.5rem'>
                      <Button isDisabled={authLoading} size='sm' onClick={() => setShowPass((prev) => !prev)}>
                        {showPass ? 'Hide' : 'Show'}
                      </Button>
                    </InputRightElement>
                  </InputGroup>

                  {!!creds.error?.length && <ErrorText error={creds.error} resetPassword={resetPassword} />}

                  <Checkbox
                    isDisabled={authLoading}
                    colorScheme='telegram'
                    mt={4}
                    size='lg'
                    checked={firstTime}
                    onChange={() => setFirstTime((prev) => !prev)}
                  >
                    I am first timer!
                  </Checkbox>
                </Stack>
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
