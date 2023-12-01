import React, { FC } from 'react';

import { Divider, Button, Flex, Center, Text, Card, CardBody, CardFooter } from '@chakra-ui/react';
import { AddIcon, MinusIcon, DeleteIcon } from '@chakra-ui/icons';

import { useBasketCard } from './hooks/useBasketCard';
import { VNpricer } from '../../utils';

import { removeBasketItem, type ShowcaseItem } from '../../store';

const CONTROL_BUTTONS_P = 2;
const ICONS_BOX_SIZE = 3;

export interface BasketCardProps extends Partial<ShowcaseItem> {
  imgPath: string;
  isDisabled?: boolean;
}

export const BasketCard: FC<BasketCardProps> = (props) => {
  const {
    id,
    title,
    // type,
    //  description,
    price,
    isDisabled,
  } = props;

  const { qty, incr, decr } = useBasketCard(props);

  return (
    <Card bg='chakra-body-bg' borderRadius={8} boxShadow='inset 0 0 0 1px var(--pixpax-colors-whiteAlpha-200)'>
      <CardBody p={2}>
        <Flex w='full' justifyContent='space-between' alignItems='center' gap={2}>
          <Flex w='calc(100% - 128px)' gap={2}>
            <Button
              isDisabled={isDisabled}
              colorScheme='red'
              variant='outline'
              h='fit-content'
              w='fit-content'
              p={CONTROL_BUTTONS_P}
              onClick={() => removeBasketItem(id)}
            >
              <DeleteIcon boxSize={ICONS_BOX_SIZE} />
            </Button>

            <Text
              fontSize='md'
              fontWeight='bold'
              lineHeight='30px'
              overflow='hidden'
              whiteSpace='nowrap'
              textOverflow='ellipsis'
            >
              {title}
            </Text>
          </Flex>

          <Flex w='120px' justifyContent='space-between' flexShrink={0}>
            <Button
              flexShrink={0}
              isDisabled={qty === 0 || isDisabled}
              variant='outline'
              h='fit-content'
              w='fit-content'
              p={CONTROL_BUTTONS_P}
              onClick={decr}
            >
              <MinusIcon boxSize={ICONS_BOX_SIZE} />
            </Button>

            <Center flexShrink={1} w='full' h='100%'>
              <Text fontSize='md' fontWeight='bold' lineHeight='30px'>
                {qty}
              </Text>
            </Center>

            <Button
              isDisabled={isDisabled}
              flexShrink={0}
              variant='outline'
              h='fit-content'
              w='fit-content'
              p={CONTROL_BUTTONS_P}
              onClick={incr}
            >
              <AddIcon boxSize={ICONS_BOX_SIZE} />
            </Button>
          </Flex>
        </Flex>
      </CardBody>

      {qty > 0 && (
        <>
          <Divider />

          <CardFooter px={2} py={0}>
            <Flex w='100%' justifyContent='space-between' fontSize='sm'>
              <Text color='chakra-subtle-text'>{`Цена: ${VNpricer.format(+price)}`}</Text>
              <Text>{`Итог: ${VNpricer.format(+price * qty)}`}</Text>
            </Flex>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
