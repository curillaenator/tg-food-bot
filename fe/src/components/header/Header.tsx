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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { InfoOutlineIcon, EmailIcon, UnlockIcon } from '@chakra-ui/icons';

import { $globalStore } from '../../store';
import { useAuth } from '../../hooks/useAuth';

export const Header: FC = () => {
  const { user } = useStore($globalStore);

  const { firstTime, creds, onCredsChange, signOut, authAction, setFirstTime } = useAuth();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const [showPass, setShowPass] = useState<boolean>(false);

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
          <AlertDialogContent p={4} display='flex' flexDirection='column' gap={4}>
            <AlertDialogHeader fontSize='3xl' fontWeight='bold' textAlign='center'>
              {!!user?.id ? user.name || 'Pax' : 'Authenticate'}
            </AlertDialogHeader>

            <AlertDialogBody>
              {!!user?.id ? (
                <div>jkdshvjk</div>
              ) : (
                <Stack spacing={4}>
                  <InputGroup>
                    <InputLeftAddon
                      h={12}
                      children={<EmailIcon boxSize={4} />} // eslint-disable-line react/no-children-prop
                    />

                    <Input
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
                      autoComplete='off'
                      placeholder='Password'
                      type={showPass ? 'text' : 'password'}
                      size='lg'
                      value={creds.password}
                      onChange={(e) => onCredsChange({ type: 'password', payload: e.target.value })}
                    />

                    <InputRightElement h='100%' display='flex' alignItems='center' width='4.5rem'>
                      <Button size='sm' onClick={() => setShowPass((prev) => !prev)}>
                        {showPass ? 'Hide' : 'Show'}
                      </Button>
                    </InputRightElement>
                  </InputGroup>

                  {!!creds.error?.length && (
                    <Text w='100%' textAlign='center' color='red.500'>
                      {creds.error}
                    </Text>
                  )}

                  <Checkbox mt={4} size='lg' checked={firstTime} onChange={() => setFirstTime((prev) => !prev)}>
                    I am first timer!
                  </Checkbox>
                </Stack>
              )}
            </AlertDialogBody>

            <AlertDialogFooter justifyContent='center'>
              <ButtonGroup width='100%' isAttached size='lg' display='flex' justifyContent='center'>
                <Button
                  p={4}
                  width='100%'
                  variant='solid'
                  h='fit-content'
                  onClick={!!user?.id ? () => signOut() : () => authAction()}
                >
                  {!!user?.id ? 'Sign out' : firstTime ? 'Sign in' : 'Go!'}
                </Button>

                <Button
                  p={4}
                  width='100%'
                  variant='outline'
                  h='fit-content'
                  color='chakra-subtle-text'
                  ref={cancelRef}
                  onClick={onClose}
                >
                  Close
                </Button>
              </ButtonGroup>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
