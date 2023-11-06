import React, { FC, useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useStore } from 'effector-react';
import cn from 'classnames';
import { Link } from 'react-router-dom';
import { ref, update, set } from 'firebase/database';
import { ref as storageRef, getDownloadURL, deleteObject } from 'firebase/storage';

import {
  Card as UICard,
  CardBody,
  Button,
  Image,
  Center,
  Stack,
  Heading,
  Text,
  // Badge,
  Input,
  InputGroup,
  Textarea,
} from '@chakra-ui/react';

import { DeleteIcon } from '@chakra-ui/icons';

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

  const onEditValue = useCallback(
    (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>, field: 'title' | 'description' | 'price') => {
      set(ref(rtdb, `items/${id}/${field}`), e.target.value);
    },
    [id],
  );

  return (
    <UICard
      id={id}
      h='full'
      p={2}
      bg='var(--color-bg-cutom)'
      borderRadius={12}
      boxShadow='inset 0 0 0 1px var(--pixpax-colors-whiteAlpha-400)'
      transition='background-color 80ms ease'
      _active={{ backgroundColor: 'var(--pixpax-colors-telegram-900)' }}
      onClick={() => {
        if (!user?.id || type !== 'item' || isEditor) return;

        setBasket({
          id,
          parent,
          title,
          description,
          type,
          price,
          waitTime,
          qty: qty === undefined ? 1 : qty,
        });
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
            {!isEditor && (
              <Stack direction='column' spacing={4}>
                <Heading size='md' textTransform='uppercase'>
                  {title}
                </Heading>

                {!!price && <Text>{VNpricer.format(+price)}</Text>}

                <Text color='chakra-subtle-text' className={cn(s.clamped, s.clamped_3)}>
                  {description}
                </Text>
              </Stack>
            )}

            {isEditor && (
              <InputGroup size='sm' flexDirection='column' gap='4px'>
                <Input placeholder='Title' defaultValue={title} onChange={(e) => onEditValue(e, 'title')} />
                <Input
                  placeholder='Price'
                  type='number'
                  defaultValue={price}
                  onChange={(e) => onEditValue(e, 'price')}
                />
                <Textarea
                  placeholder='Description'
                  defaultValue={description}
                  onChange={(e) => onEditValue(e, 'description')}
                  resize='none'
                  rows={5}
                />
              </InputGroup>
            )}

            {/* {!!waitTime && (
              <Stack direction='row'>
                <Badge textTransform='lowercase' color='chakra-subtle-text'>
                  <TimeIcon />
                  {`${waitTime}`}
                </Badge>
              </Stack>
            )} */}
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
