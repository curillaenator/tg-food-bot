import React, { FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from 'effector-react';
import { signInAnonymously } from 'firebase/auth';

import {
  Flex,
  Spacer,
  Heading,
  ButtonGroup,
  Button,
  Avatar,
  Progress,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Stack,
  Checkbox,
} from '@chakra-ui/react';

import { HamburgerIcon, ChevronLeftIcon, SmallAddIcon, CopyIcon, CalendarIcon, AttachmentIcon } from '@chakra-ui/icons';

import { auth } from '../../shared/firebase';
import { $globalStore, setEditor, setTouched } from '../../store';
import { useAuth } from '../../hooks/useAuth';

import { useOverlaysControl } from './hooks/useOverlaysControl';
import { useTelegramConnect } from './hooks/useTelegramConnect';

import { Profile } from '../profile';
import { Basket } from '../basket';
import { SignForm } from '../signForm';

import { Logo } from '../../assets/Logo';
import { BasketIcon } from '../../assets/BasketIcon';

import s from './styles.module.scss';

export const UserSection: FC = () => {
  const { user, basket, isEditor, touched } = useStore($globalStore);
  useTelegramConnect(user);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { isAuthOpen, isBasketOpen, onAuthOpen, onBasketOpen, onAuthClose, onBasketClose } = useOverlaysControl();

  const finalFocusRef = React.useRef<HTMLButtonElement>(null);

  const { authLoading, firstTime, creds, onCredsChange, signOut, authAction, setFirstTime, resetPassword } = useAuth();

  const isHomePage = pathname === '/';
  const role = user?.role;

  useEffect(() => {
    if (!!user?.id) return;
    if (!!basket.length) setTouched();
  }, [user, basket]);

  useEffect(() => {
    if (!touched) return;

    console.log('fires');

    signInAnonymously(auth)
      .then(() => console.info('App is connected'))
      .catch((err) => console.table(err));
  }, [touched]);

  return (
    <>
      <Flex
        as='header'
        p={4}
        borderBottom='1px solid var(--pixpax-colors-whiteAlpha-400)'
        alignItems='çenter'
        bg='var(--color-bg-cutom)'
        position='sticky'
        top={0}
        borderRadius='0 0 16px 16px'
        zIndex={100}
        mb={6}
      >
        {isHomePage ? (
          <Flex alignItems='center' gap={1}>
            <Logo boxSize={10} />

            <Heading as='h1' fontSize='3xl' fontWeight='1000' color='yellow.300' lineHeight='1'>
              PixPax
            </Heading>
          </Flex>
        ) : (
          <Button
            leftIcon={<ChevronLeftIcon boxSize={8} />}
            h='fit-content'
            variant='ghost'
            p={2}
            onClick={() => navigate('/')}
          >
            Главная
          </Button>
        )}

        <Spacer />

        {!user?.id ? (
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
                {basket.reduce((cnt, item) => cnt + item.qty, 0)}
              </Button>
            )}

            <Button h='fit-content' variant='ghost' p={2} onClick={onAuthOpen}>
              <HamburgerIcon boxSize={8} />
            </Button>
          </Flex>
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
                {basket.reduce((cnt, item) => cnt + item.qty, 0)}
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

      <Drawer size='full' isOpen={isAuthOpen} placement='right' onClose={onAuthClose} finalFocusRef={finalFocusRef}>
        <DrawerOverlay />

        <DrawerContent className={s.authBg}>
          <DrawerCloseButton size='lg' h='fit-content' px={2} py={4} color='white' top={4} right={4} />

          <DrawerHeader p={4} bg='blackAlpha.300'>
            <Flex gap={1} alignItems='center' h='48px'>
              <Heading>{!!user?.id ? '' : 'Войти'}</Heading>

              {!!user?.id && (
                <Button color='whiteAlpha.200' size='xs' variant='ghost' onClick={signOut}>
                  Выйти
                </Button>
              )}
            </Flex>
          </DrawerHeader>

          {authLoading && <Progress size='xs' isIndeterminate />}

          <DrawerBody p={4}>
            <Stack gap={6}>
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

              {user?.id && (role === 'manager' || role === 'admin') && (
                <Stack w='full' gap={4}>
                  <Stack w='full' gap={2}>
                    <Checkbox
                      size='lg'
                      defaultChecked={isEditor}
                      checked={isEditor}
                      onChange={(e) => setEditor(e.target.checked)}
                    >
                      Включить editMode
                    </Checkbox>
                  </Stack>

                  <ButtonGroup orientation='vertical' variant='outline' isAttached w='full'>
                    <Button
                      leftIcon={<CopyIcon boxSize={6} />}
                      size='md'
                      w='full'
                      onClick={() => {
                        navigate('/orders');
                        onAuthClose();
                      }}
                    >
                      Заявки
                    </Button>

                    <Button
                      leftIcon={<SmallAddIcon boxSize={8} />}
                      size='md'
                      w='full'
                      onClick={() => {
                        navigate('/add');
                        onAuthClose();
                      }}
                    >
                      Добавить
                    </Button>

                    <Button leftIcon={<CalendarIcon boxSize={6} />} size='md' w='full'>
                      Отчеты
                    </Button>
                  </ButtonGroup>
                </Stack>
              )}

              {user?.ownerOf && (
                <ButtonGroup>
                  <Button
                    leftIcon={<AttachmentIcon boxSize={6} />}
                    size='md'
                    w='full'
                    onClick={() => {
                      navigate('service');
                      onAuthClose();
                    }}
                  >
                    Мои сервисы
                  </Button>
                </ButtonGroup>
              )}

              <ButtonGroup isAttached w='full'>
                {!user?.id && (
                  <Button
                    width='100%'
                    variant='solid'
                    colorScheme='telegram'
                    isDisabled={authLoading}
                    onClick={authAction}
                  >
                    {firstTime ? 'Зарегистрироваться' : 'Go!'}
                  </Button>
                )}

                <Button
                  size='md'
                  width='100%'
                  variant={!!user?.id ? 'solid' : 'outline'}
                  colorScheme={!!user?.id ? 'telegram' : undefined}
                  color={!!user?.id ? undefined : 'chakra-subtle-text'}
                  isDisabled={authLoading}
                  onClick={onAuthClose}
                >
                  {!!user?.id ? 'Ok' : 'Закрыть'}
                </Button>
              </ButtonGroup>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Basket isBasketOpen={isBasketOpen} onBasketClose={onBasketClose} />
    </>
  );
};
