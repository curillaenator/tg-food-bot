import React, { FC, useState, useEffect, useRef, type ChangeEvent } from 'react';
import { useStore } from 'effector-react';
import { ref, set } from 'firebase/database';

import {
  Box,
  Flex,
  Stack,
  Button,
  Heading,
  Text,
  Input,
  Drawer,
  DrawerBody,
  // DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Stat,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';

import { $globalStore, setUser } from '../../store';
import { rtdb } from '../../shared/firebase';

import { BasketCard } from './BasketCard';
import { BasketIcon } from '../../assets/BasketIcon';
import { SendIcon } from '../../assets/SendIcon';

import { useOrder } from './hooks/useOrder';
import { VNpricer, debounced } from '../../utils';
import { DELIVERY_PRICE } from '../../shared/constants';
// import type { User } from '../../shared/interfaces';

import s from './styles.module.scss';

interface BasketProps {
  isBasketOpen: boolean;
  onBasketClose: () => void;
}

const onAdressEdit = (e: ChangeEvent<HTMLInputElement>, userId: string, field: 'adress' | 'tel' | 'name') => {
  set(ref(rtdb, `users/${userId}/${field}`), e.target.value);
};

const POST_DELAY = 1000;

const onAdressEditDebounced = debounced(onAdressEdit, POST_DELAY);

export const Basket: FC<BasketProps> = (props) => {
  const { isBasketOpen, onBasketClose } = props;
  const { user, basket } = useStore($globalStore);

  const initialFocusRef = React.useRef();
  const finalFocusRef = React.useRef();

  const [parents, setParents] = useState<string[]>([]);
  const [totalPriceAcc, setTotalPriceAcc] = useState<Record<string, number>>({});
  const calcedTotalPrice = Object.values(totalPriceAcc).reduce((acc, item) => acc + item, 0);

  const { loading, onPlaceOrder } = useOrder(onBasketClose);

  useEffect(() => {
    const parentsFromBasket: string[] = [];

    const effectiveTotal = Object.fromEntries(
      basket.map(({ id, price, qty, parent }) => {
        parentsFromBasket.push(parent);

        return [id, +price * qty];
      }),
    );

    setParents([...new Set(parentsFromBasket)]);
    setTotalPriceAcc(effectiveTotal);
  }, [basket]);

  const [locked, setLocked] = useState<boolean>(true);

  const timer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (!user?.id) return;
    if (!!timer.current) clearTimeout(timer.current);

    const isContacts = !!user?.name.trim().length && !!user?.adress.trim().length && !!user?.tel.trim().length;

    if (!isContacts) {
      setLocked(true);
      return;
    }

    timer.current = setTimeout(() => setLocked(false), POST_DELAY * 1.5);
  }, [user]);

  const deliveryPrice = DELIVERY_PRICE * parents.length;

  return (
    <Drawer size='full' isOpen={isBasketOpen} placement='right' onClose={onBasketClose} finalFocusRef={finalFocusRef}>
      <DrawerOverlay />

      <DrawerContent className={s.basketBg}>
        <DrawerCloseButton size='lg' h='fit-content' px={2} py={4} color='whiteAlpha.400' top={4} right={4} />

        <DrawerHeader
          p={4}
          bg='var(--color-bg-cutom)'
          borderRadius='0 0 0 16px'
          borderBottom='1px solid var(--pixpax-colors-whiteAlpha-400)'
        >
          <Flex alignItems='center' gap={1}>
            <Box p={0}>
              <BasketIcon boxSize={10} color='chakra-body-text' />
            </Box>

            <Heading fontSize='2xl' lineHeight='48px' color='yellow.400'>
              Ваш заказ
            </Heading>
          </Flex>
        </DrawerHeader>

        <DrawerBody p={4}>
          <Stack gap={2}>
            {basket.map((basketItem) => (
              <BasketCard key={basketItem.id} imgPath='' {...basketItem} isDisabled={loading} />
            ))}
          </Stack>

          <Stat w='full' pt={8}>
            <StatHelpText>
              <Flex justifyContent='space-between'>
                <Text>Заказ</Text>
                <Text>{VNpricer.format(calcedTotalPrice)}</Text>
              </Flex>

              <Flex justifyContent='space-between'>
                <Text>Доставка</Text>
                <Text>{VNpricer.format(calcedTotalPrice > 0 ? deliveryPrice : 0)}</Text>
              </Flex>
            </StatHelpText>

            <StatNumber>
              <Flex justifyContent='space-between'>
                <Text>Итог</Text>
                <Text>
                  {calcedTotalPrice > 0 ? VNpricer.format(calcedTotalPrice + deliveryPrice) : VNpricer.format(0)}
                </Text>
              </Flex>
            </StatNumber>
          </Stat>

          {user?.id && (
            <Stack gap={2} pt={4} pb={2}>
              <Text>Контактная информация</Text>

              <Text fontSize='xs' color='chakra-subtle-text'>
                Как Вас зовут?
              </Text>
              <Input
                defaultValue={user.name}
                placeholder='коротко и ясно!'
                size='md'
                onBlur={(e) => {
                  setUser({ ...user, name: e.target.value });
                  onAdressEdit(e, user.id, 'name');
                }}
                onChange={(e) => {
                  setUser({ ...user, name: e.target.value });
                  onAdressEditDebounced(e, user.id, 'name');
                }}
              />

              <Text fontSize='xs' color='chakra-subtle-text'>
                Где вы находитесь?
              </Text>
              <Input
                defaultValue={user?.adress}
                placeholder='чем точнее тем лучше ;-)'
                size='md'
                onBlur={(e) => {
                  setUser({ ...user, adress: e.target.value });
                  onAdressEdit(e, user.id, 'adress');
                }}
                onChange={(e) => {
                  setUser({ ...user, adress: e.target.value });
                  onAdressEditDebounced(e, user.id, 'adress');
                }}
              />

              <Text fontSize='xs' color='chakra-subtle-text'>
                Как с Вами связаться?
              </Text>
              <Input
                defaultValue={user?.tel || user?.tme}
                placeholder='телефон или t.me/вашИмяПользователя'
                size='md'
                onBlur={(e) => {
                  setUser({ ...user, tel: e.target.value });
                  onAdressEdit(e, user.id, 'tel');
                }}
                onChange={(e) => {
                  setUser({ ...user, tel: e.target.value });
                  onAdressEditDebounced(e, user.id, 'tel');
                }}
              />
            </Stack>
          )}

          <Button
            isLoading={loading}
            loadingText='Секундочку...'
            isDisabled={locked || !calcedTotalPrice || !user?.id}
            ref={initialFocusRef}
            size='md'
            onClick={onPlaceOrder}
            mt={8}
            w='full'
            fontSize='xl'
            fontWeight='800'
            leftIcon={<SendIcon boxSize={8} />}
          >
            Отправить
          </Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
