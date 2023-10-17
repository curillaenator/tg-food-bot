import React, { FC, useState, useEffect } from 'react';
import { useStore } from 'effector-react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { ref, update } from 'firebase/database';
import { ref as storageRef, getDownloadURL, deleteObject } from 'firebase/storage';

import { Card as UICard, CardBody, Button, Image, Center, Stack, Heading, Text, Spacer, Badge } from '@chakra-ui/react';

import { TimeIcon, DeleteIcon } from '@chakra-ui/icons';

import { strg, rtdb } from '../../shared/firebase';

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
    parent,
    // likes,
    qty,
  } = props;

  const { user, isEditor } = useStore($globalStore);

  const [imageURL, setImageURL] = useState<string | undefined>(undefined);

  useEffect(() => {
    getDownloadURL(storageRef(strg, imgPath)).then((url) => setImageURL(url));
  }, [imgPath]);

  return (
    <UICard
      id={id}
      h='full'
      p={2}
      bg='chakra-body-bg'
      borderRadius={12}
      boxShadow='inset 0 0 0 1px var(--pixpax-colors-whiteAlpha-400)'
      transition='background-color 80ms ease'
      _active={{ backgroundColor: 'var(--pixpax-colors-telegram-900)' }}
      onClick={() => {
        if (!user?.id || type !== 'item') return;

        setBasket({ id, title, description, type, price, waitTime, qty });
      }}
    >
      <CardBody p={0}>
        <Stack direction='column' h='100%' spacing={6}>
          <Center flexShrink={0} aspectRatio='1 / 1' w='100%'>
            <Image
              src={imageURL}
              alt={title}
              borderRadius={8}
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

          {isEditor && type === 'item' && (
            <Stack>
              <Button
                leftIcon={<DeleteIcon boxSize={4} />}
                colorScheme='red'
                size='sm'
                p={2}
                variant='outline'
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  if (confirm('Точно удалить товар из базы?')) {
                    deleteObject(storageRef(strg, `items/${id}`));

                    update(ref(rtdb), {
                      [`services/${parent}/categories/${id}`]: null,
                      [`items/${id}`]: null,
                    });
                  }
                }}
              >
                Удалить
              </Button>
            </Stack>
          )}
        </Stack>
      </CardBody>
    </UICard>
  );
};
