import React, { FC } from 'react';

import {
  Divider,
  Button,
  Flex,
  Center,
  Heading,
  Stack,
  Image,
  Text,
  Card,
  CardBody,
  CardFooter,
} from '@chakra-ui/react';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';

import { useBasketCard } from './hooks/useBasketCard';
import { VNpricer } from '../../utils';

import {
  // setBasket,
  type ShowcaseItem,
} from '../../store';

export interface BasketCardProps extends Partial<ShowcaseItem> {
  imgPath: string;
  updateTotalPrice: (key: string, acc: number) => void;
}

export const BasketCard: FC<BasketCardProps> = (props) => {
  const {
    // id,
    title,
    // type,
    //  description,
    price,
  } = props;

  const { imgURL, qty, incr, decr } = useBasketCard(props);

  return (
    <Card bg='chakra-body-bg' borderRadius={8} boxShadow='inset 0 0 0 1px var(--pixpax-colors-whiteAlpha-200)'>
      <CardBody p={2}>
        <Flex gap={2}>
          <Center aspectRatio='1 / 1' w='50%'>
            <Image w='100%' h='100%' borderRadius={4} objectFit='cover' src={imgURL} alt={title} />
          </Center>

          <Stack w='50%' justifyContent='space-between'>
            <Stack>
              <Heading>{title}</Heading>

              <Text>{VNpricer.format(+price)}</Text>
            </Stack>

            <Flex w='full' py={2} justifyContent='space-between'>
              <Button isDisabled={qty === 0} variant='outline' h='fit-content' p={2} onClick={decr}>
                <MinusIcon boxSize={6} />
              </Button>

              <Center h='100%'>
                <Text>{qty}</Text>
              </Center>

              <Button variant='outline' h='fit-content' p={2} onClick={incr}>
                <AddIcon boxSize={6} />
              </Button>
            </Flex>
          </Stack>
        </Flex>
      </CardBody>

      {qty > 0 && (
        <>
          <Divider />

          <CardFooter p={2}>
            <Flex w='100%' justifyContent='space-between'>
              <Text color='chakra-subtle-text'>Subtotal</Text>

              <Text>{VNpricer.format(+price * qty)}</Text>
            </Flex>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
