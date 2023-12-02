import React, { FC, useState, useEffect } from 'react';
import { useStore } from 'effector-react';

import {
  Box,
  Flex,
  Stack,
  Button,
  Heading,
  Text,
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

import { $globalStore } from '../../store';

import { BasketCard } from './BasketCard';
import { BasketIcon } from '../../assets/BasketIcon';

import { useOrder } from './hooks/useOrder';
import { VNpricer } from '../../utils';
import { DELIVERY_PRICE } from '../../shared/constants';

import s from './styles.module.scss';

interface BasketProps {
  isBasketOpen: boolean;
  onBasketClose: () => void;
}

export const Basket: FC<BasketProps> = (props) => {
  const { isBasketOpen, onBasketClose } = props;
  const { basket } = useStore($globalStore);

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

  const deliveryPrice = DELIVERY_PRICE * parents.length;

  return (
    <Drawer size='full' isOpen={isBasketOpen} placement='right' onClose={onBasketClose} finalFocusRef={finalFocusRef}>
      <DrawerOverlay />

      <DrawerContent className={s.basketBg}>
        <DrawerCloseButton size='lg' h='fit-content' px={2} py={4} color='whiteAlpha.400' top={4} right={4} />

        <DrawerHeader p={4} bg='blackAlpha.300'>
          <Flex alignItems='center' gap={1}>
            <Box p={2}>
              <BasketIcon fill='var(--pixpax-colors-chakra-body-text)' />
            </Box>

            <Heading fontSize='2xl' lineHeight='48px' color='yellow.400'>
              Ваш заказ
            </Heading>
          </Flex>
        </DrawerHeader>

        <DrawerBody p={4}>
          <Stack gap={4}>
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

          <Button
            isLoading={loading}
            loadingText='Секундочку...'
            isDisabled={!calcedTotalPrice}
            ref={initialFocusRef}
            size='lg'
            p={2}
            h='fit-content'
            variant='solid'
            onClick={onPlaceOrder}
            fontSize='3xl'
            mt={8}
            w='100%'
          >
            Отправить
          </Button>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
