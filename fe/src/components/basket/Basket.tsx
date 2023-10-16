import React, { FC, useState, useCallback } from 'react';
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
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Stat,
  StatNumber,
  StatHelpText,
  // StatArrow,
  // StatGroup,
} from '@chakra-ui/react';

import { $globalStore } from '../../store';

import { BasketCard } from './BasketCard';
import { BasketIcon } from '../../assets/BasketIcon';

import s from './styles.module.scss';

// import { BASKET_MOCK } from './mock';
import { VNpricer } from '../../utils';
import { DELIVERY_PRICE } from '../../shared/constants';

interface BasketProps {
  isBasketOpen: boolean;
  onBasketClose: () => void;
}

export const Basket: FC<BasketProps> = (props) => {
  const { isBasketOpen, onBasketClose } = props;
  const { basket } = useStore($globalStore);

  const [totalPrice, setTotalPrice] = useState<Record<string, number>>({});
  const updateTotalPrice = useCallback(
    (key: string, acc: number) => setTotalPrice((prev) => ({ ...prev, [key]: acc })),
    [],
  );

  const initialFocusRef = React.useRef();
  const finalFocusRef = React.useRef();

  const calcedTotalPrice = Object.values(totalPrice).reduce((acc, item) => acc + item, 0);

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
              Is it right?
            </Heading>
          </Flex>
        </DrawerHeader>

        <DrawerBody p={4}>
          <Stack gap={4}>
            {basket.map((basketItem) => (
              <BasketCard
                key={basketItem.id}
                // types ))
                imgPath=''
                {...basketItem}
                updateTotalPrice={updateTotalPrice}
              />
            ))}
          </Stack>

          <Stat w='full' pt={8}>
            <StatHelpText>
              <Flex justifyContent='space-between'>
                <Text>Subtotal</Text>
                <Text>{VNpricer.format(calcedTotalPrice)}</Text>
              </Flex>

              <Flex justifyContent='space-between'>
                <Text>Delivery</Text>
                <Text>{VNpricer.format(DELIVERY_PRICE)}</Text>
              </Flex>
            </StatHelpText>

            <StatNumber>
              <Flex justifyContent='space-between'>
                <Text>Total</Text>
                <Text>
                  {calcedTotalPrice > 0 ? VNpricer.format(calcedTotalPrice + DELIVERY_PRICE) : VNpricer.format(0)}
                </Text>
              </Flex>
            </StatNumber>
          </Stat>
        </DrawerBody>

        <DrawerFooter p={4}>
          <Button
            isDisabled={!calcedTotalPrice}
            ref={initialFocusRef}
            size='lg'
            p={8}
            h='fit-content'
            variant='solid'
            onClick={onBasketClose}
            fontSize='3xl'
            w='100%'
          >
            Yes
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
