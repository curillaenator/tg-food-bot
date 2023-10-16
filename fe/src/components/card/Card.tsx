import React, { FC } from 'react';
import { useStore } from 'effector-react';
import cn from 'classnames';
import { Link } from 'react-router-dom';

import { Card as UICard, CardBody, Image, Center, Stack, Heading, Text, Spacer, Badge } from '@chakra-ui/react';
import { TimeIcon } from '@chakra-ui/icons';

import { setBasket, $globalStore } from '../../store';
import { VNpricer } from '../../utils';

import s from './styles.module.scss';
import type { CardProps } from './interfaces';

export const Card: FC<CardProps> = (props) => {
  const { to, type, ...rest } = props;

  if (!!to && type !== 'item')
    return (
      <Link to={to}>
        <CardComponent {...rest} />
      </Link>
    );

  return <CardComponent {...rest} type={type} />;
};

const CardComponent: FC<CardProps> = (props) => {
  const {
    id,
    title,
    description,
    imgPath,
    price,
    type,
    waitTime,
    // parent,
    // likes,
    qty,
  } = props;

  const { user } = useStore($globalStore);

  // console.log(parent);

  return (
    <UICard
      id={id}
      p={2}
      bg='chakra-body-bg'
      borderRadius={8}
      boxShadow='inset 0 0 0 1px var(--pixpax-colors-whiteAlpha-200)'
      transition='background-color 80ms ease'
      _active={type === 'item' && { backgroundColor: 'var(--pixpax-colors-telegram-900)' }}
      onClick={() => {
        if (!user?.id || type !== 'item') return;
        setBasket({ id, title, description, type, price, waitTime, qty });
      }}
    >
      <CardBody p={0}>
        <Stack direction='column' h='100%' spacing={6}>
          <Center flexShrink={0} aspectRatio='1 / 1' w='100%'>
            <Image
              src={imgPath}
              alt={title}
              borderRadius={4}
              objectFit='cover'
              w='100%'
              aspectRatio='1 / 1'
              fallback={<Text>No image</Text>}
              loading='lazy'
            />
          </Center>

          <Stack direction='column' spacing={6} h='100%' justifyContent='space-between'>
            <Stack direction='column' spacing={4}>
              <Heading size='md' textTransform='uppercase'>
                {title}
              </Heading>

              {!!price && <Text>{VNpricer.format(+price)}</Text>}

              <Text color='chakra-subtle-text' className={cn(s.clamped, s.clamped_3)}>
                {description}
              </Text>
            </Stack>

            {!!waitTime && (
              <Stack direction='row'>
                <Badge textTransform='lowercase' color='chakra-subtle-text'>
                  <TimeIcon />
                  {` ${waitTime}`}
                </Badge>

                <Spacer />
              </Stack>
            )}
          </Stack>
        </Stack>
      </CardBody>
    </UICard>
  );
};
