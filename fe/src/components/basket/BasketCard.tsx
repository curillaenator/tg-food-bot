import React, { FC } from 'react';

import { Image, Divider, Button, Flex, Stack, Text, Card, CardBody, CardFooter, Box } from '@chakra-ui/react';
import { AddIcon, MinusIcon, DeleteIcon } from '@chakra-ui/icons';

import { useBasketCard } from './hooks/useBasketCard';
import { VNpricer } from '../../utils';

import { removeBasketItem } from '../../store';
import type { Item } from '../../shared/interfaces';

const ICONS_BOX_SIZE = 3;

export interface BasketCardProps extends Partial<Item> {
  imgPath: string;
  isDisabled?: boolean;
}

export const BasketCard: FC<BasketCardProps> = (props) => {
  const { id, title, price, isDisabled } = props;

  const { imageUrl, qty, incr, decr } = useBasketCard(props);

  return (
    <Card w='100%' bg='chakra-body-bg' borderRadius={8} boxShadow='inset 0 0 0 1px var(--pixpax-colors-whiteAlpha-200)'>
      <CardBody p={2} w='100%'>
        <Flex w='100%' alignItems='flex-start' justifyContent='space-between' gap={2}>
          <Box w='25%' aspectRatio='1 / 1' flexShrink={0}>
            <Image
              borderRadius={6}
              w='full'
              aspectRatio='1 / 1'
              objectFit='cover'
              src={imageUrl}
              alt={title}
              border='1px solid var(--pixpax-colors-telegram-200)'
            />
          </Box>

          <Stack w='calc(75% - 8px)' gap={0} flexShrink={1}>
            <Flex gap={2} w='100%' justifyContent='space-between'>
              <Text
                display='block'
                w='calc(100% - 32px - 16px)'
                fontSize='md'
                fontWeight='bold'
                overflow='hidden'
                whiteSpace='nowrap'
                textOverflow='ellipsis'
                color='telegram.200'
                mb={2}
              >
                {title}
              </Text>

              <Button
                isDisabled={isDisabled}
                w='32px'
                // colorScheme='red'
                color='red.700'
                opacity={0.6}
                variant='outline'
                size='sm'
                onClick={() => removeBasketItem(id)}
              >
                <DeleteIcon boxSize={ICONS_BOX_SIZE} />
              </Button>
            </Flex>

            <Text size='sm' color='chakra-subtle-text'>
              Количество:
            </Text>

            <Flex w='full' h='32px' justifyContent='space-between'>
              <Button
                w='64px'
                flexShrink={0}
                isDisabled={qty === 0 || isDisabled}
                variant='outline'
                size='sm'
                onClick={decr}
              >
                <MinusIcon boxSize={ICONS_BOX_SIZE} />
              </Button>

              <Text flexShrink={1} w='full' fontSize='md' fontWeight='bold' textAlign='center'>
                {qty}
              </Text>

              <Button w='64px' isDisabled={isDisabled} flexShrink={0} variant='outline' size='sm' onClick={incr}>
                <AddIcon boxSize={ICONS_BOX_SIZE} />
              </Button>
            </Flex>
          </Stack>
        </Flex>

        {qty > 0 && (
          <CardFooter display='flex' flexDirection='column' p={0} mt={2}>
            <Divider mt={2} />

            <Flex w='100%' justifyContent='space-between' fontSize='sm'>
              <Text color='chakra-subtle-text'>{`Цена: ${VNpricer.format(+price)}`}</Text>
              <Text>{`Итог: ${VNpricer.format(+price * qty)}`}</Text>
            </Flex>
          </CardFooter>
        )}
      </CardBody>
    </Card>
  );
};
