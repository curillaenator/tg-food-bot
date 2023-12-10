import React, { FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStore } from 'effector-react';
import { ref, set } from 'firebase/database';
import { signInAnonymously } from 'firebase/auth';
import axios from 'axios';

import {
  Flex,
  Spacer,
  Heading,
  ButtonGroup,
  Button,
  Link,
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

import {
  HamburgerIcon,
  ChevronLeftIcon,
  SmallAddIcon,
  CopyIcon,
  CalendarIcon,
  AttachmentIcon,
  QuestionOutlineIcon,
} from '@chakra-ui/icons';

import { auth, rtdb } from '../../shared/firebase';
import { $globalStore, setEditor, setTouched } from '../../store';
import { useAuth } from '../../hooks/useAuth';

import { useOverlaysControl } from './hooks/useOverlaysControl';
import { useTelegramConnect } from './hooks/useTelegramConnect';

import { Sidebar } from '../sidebar';

import { Profile } from '../profile';
import { Basket } from '../basket';
import { SignForm } from '../signForm';

import { Logo } from '../../assets/Logo';
import { BasketIcon } from '../../assets/BasketIcon';
import { MessageIcon } from '../../assets/MessageIcon';

import s from './styles.module.scss';

export const UserSection: FC = () => {
  const { user, basket, isEditor, touched } = useStore($globalStore);

  const { tg, tgQueryId } = useTelegramConnect(user);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const {
    isAuthOpen,
    isBasketOpen,
    isMenuOpen,
    onAuthOpen,
    onBasketOpen,
    onAuthClose,
    onBasketClose,
    onMenuClose,
    onMenuOpen,
  } = useOverlaysControl();

  const finalFocusRef = React.useRef<HTMLButtonElement>(null);

  const { authLoading, firstTime, creds, onCredsChange, signOut, authAction, setFirstTime, resetPassword } = useAuth();

  const tgPostMyId = () => {
    if (!!tgQueryId && user?.id) {
      axios.post(
        process.env.TG_BOT_API,
        {
          queryId: tgQueryId,
          orderId: '-----------',
          title: 'Сервисное сообщение',
          clientSupport: `\nВаш ID:\n${user.id}`,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }
  };

  const isHomePage = pathname === '/';
  const isCategoryPage = !!pathname.match(/\/category.*/);
  const role = user?.role;

  // silent auth start
  useEffect(() => {
    if (!!user?.id) return;
    if (!!basket.length) setTouched();
  }, [user, basket]);

  useEffect(() => {
    if (!touched) return;

    signInAnonymously(auth)
      .then(() => console.info('App is connected'))
      .catch((err) => console.table(err));
  }, [touched]);
  // silent auth end

  // store basket start
  useEffect(() => {
    if (user?.id) set(ref(rtdb, `users/${user.id}/basket`), basket);
  }, [user, basket]);
  // store basket start

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

            <Heading as='h1' fontSize='3xl' fontWeight='1000' color='white' lineHeight='1'>
              PixPax
            </Heading>
          </Flex>
        ) : (
          <Button
            leftIcon={isCategoryPage ? undefined : <ChevronLeftIcon boxSize={8} />}
            // h='fit-content'
            h='48px'
            variant='ghost'
            size='md'
            p={2}
            onClick={() => {
              if (isCategoryPage) {
                onMenuOpen();
              } else {
                navigate('/');
              }
            }}
          >
            {isCategoryPage ? 'Меню' : 'Главная'}
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
                leftIcon={<BasketIcon boxSize={8} />}
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
                rightIcon={<BasketIcon boxSize={8} />}
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
              <Heading>{!!user?.id ? '' : 'Кабинет'}</Heading>

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
                      leftIcon={<CopyIcon boxSize={4} />}
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
                      leftIcon={<SmallAddIcon boxSize={6} />}
                      size='md'
                      w='full'
                      onClick={() => {
                        navigate('/add');
                        onAuthClose();
                      }}
                    >
                      Добавить
                    </Button>

                    <Button
                      leftIcon={<CalendarIcon boxSize={4} />}
                      size='md'
                      w='full'
                      onClick={() => {
                        navigate('/reports');
                        onAuthClose();
                      }}
                    >
                      Отчеты
                    </Button>
                  </ButtonGroup>
                </Stack>
              )}

              {user?.ownerOf && (
                <ButtonGroup isAttached w='full' orientation='vertical'>
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
                  isDisabled={authLoading}
                  onClick={onAuthClose}
                >
                  {!!user?.id ? 'Ok' : 'Закрыть'}
                </Button>
              </ButtonGroup>

              <ButtonGroup isAttached w='full' orientation='vertical' variant='outline'>
                <Button
                  href={`https://${process.env.SUPPORT_CONTACT}`}
                  as={Link}
                  size='md'
                  w='full'
                  leftIcon={<MessageIcon boxSize={6} />}
                  onClick={() => {
                    if (!!tg) setTimeout(() => tg.close(), 100);
                  }}
                >
                  Связаться с PixPax
                </Button>
              </ButtonGroup>

              {!!tgQueryId && !!user?.email && (
                <ButtonGroup>
                  <Button
                    variant='outline'
                    leftIcon={<QuestionOutlineIcon boxSize={6} />}
                    size='md'
                    w='full'
                    onClick={tgPostMyId}
                  >
                    Получить мой ID
                  </Button>
                </ButtonGroup>
              )}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Sidebar isOpen={isMenuOpen} onClose={onMenuClose} />

      <Basket isBasketOpen={isBasketOpen} onBasketClose={onBasketClose} />
    </>
  );
};
