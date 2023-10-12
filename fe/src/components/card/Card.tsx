import React, { FC } from 'react';
import cn from 'classnames';
// import { ref, set } from 'firebase/database';

import { Card as UICard, CardBody, Image, Center, Stack, Heading, Text, Spacer, Badge } from '@chakra-ui/react';
import {
  TimeIcon,
  // StarIcon,
  //   SmallAddIcon,
  //    MinusIcon
} from '@chakra-ui/icons';

// import { strg, rtdb } from '../../shared/firebase';

import s from './styles.module.scss';
import type { CardProps } from './interfaces';

const pricer = new Intl.NumberFormat('vi-IT', { style: 'currency', currency: 'VND' });

export const Card: FC<CardProps> = (props) => {
  const {
    id,
    title,
    description,
    imgPath,
    price,
    waitTime,
    // likes,
    //  qty
  } = props;

  // const onLike = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   set(ref(rtdb, `menu/${id}/likes`), +likes + 1);
  // };

  return (
    <UICard id={id} p={2}>
      <CardBody p={0}>
        <Stack direction='column' h='100%' spacing={6}>
          <Center flexShrink={0}>
            {imgPath ? <Image src={imgPath} aspectRatio='1 / 1' objectFit='cover' w='100%' /> : 'No image'}
          </Center>

          <Stack direction='column' spacing={6} h='100%' justifyContent='space-between'>
            <Stack direction='column' spacing={4}>
              <Heading size='md' textTransform='uppercase'>
                {title}
              </Heading>

              <Text>{pricer.format(+price)}</Text>

              <Text color='chakra-subtle-text' className={cn(s.clamped, s.clamped_3)}>
                {description}
              </Text>
            </Stack>

            <Stack direction='row'>
              <Badge textTransform='lowercase' color='chakra-subtle-text'>
                <TimeIcon />
                {` ${waitTime}`}
              </Badge>

              <Spacer />
            </Stack>
          </Stack>
        </Stack>
      </CardBody>
    </UICard>
  );
};
