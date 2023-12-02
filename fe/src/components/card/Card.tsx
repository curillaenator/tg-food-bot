import React, { FC, useState, useEffect, ChangeEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from 'effector-react';
import parse from 'html-react-parser';
import { Link } from 'react-router-dom';
import { ref, set, update } from 'firebase/database';
import { ref as storageRef, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';

import {
  Card as UICard,
  CardBody,
  Button,
  Image,
  Center,
  Stack,
  Heading,
  Text,
  Input,
  InputGroup,
  Textarea,
  Progress,
  Checkbox,
  // useToast,
} from '@chakra-ui/react';

import { DeleteIcon, EditIcon } from '@chakra-ui/icons';

import { strg, rtdb } from '../../shared/firebase';

import { setBasket, $globalStore } from '../../store';
import { debounced, resizeFile, VNpricer } from '../../utils';

import { IMAGE_META } from '../../shared/constants';
import type { CardProps } from './interfaces';
// import s from './styles.module.scss';

import noImage from './assets/no-image.jpg';

const onEditValue = (
  e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  field: 'title' | 'description' | 'price',
  itemId: string,
) => {
  let value = e.target.value;

  if (field === 'description') {
    value = e.target.value.replace(/\n/g, '<br />');
  }

  set(ref(rtdb, `items/${itemId}/${field}`), value);
};

const onImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
  const itemId = e.currentTarget.dataset.itemid;

  const resizedFile = await resizeFile(e.target.files[0]);
  const renamedFile = new File([resizedFile], itemId);

  await uploadBytes(storageRef(strg, `items/${itemId}`), renamedFile, IMAGE_META);
};

const onEditValueDebounced = debounced(onEditValue, 1500);

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

const CardComponent: FC<CardProps & { isActive?: boolean }> = (props) => {
  const {
    id,
    title,
    description,
    imgPath,
    price,
    type,
    waitTime,
    parent,
    qty,
    isActive,
    onMenuItemRemove = () => {},
  } = props;

  const { pathname } = useLocation();

  // const toast = useToast();

  const { user, isEditor } = useStore($globalStore);

  const [imageURL, setImageURL] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const removeCard = async (serviceId: string, itemId: string) => {
    await update(ref(rtdb), {
      [`services/${serviceId}/categories/${itemId}`]: null,
      [`items/${itemId}`]: null,
    });

    if (imageURL) await deleteObject(storageRef(strg, `items/${itemId}`)).catch((err) => console.table(err));

    onMenuItemRemove(serviceId, itemId);
  };

  useEffect(() => {
    if (!imgPath) return;

    setLoading(true);

    getDownloadURL(storageRef(strg, imgPath))
      .then((url) => setImageURL(url))
      .catch((err) => console.table(err))
      .finally(() => setLoading(false));
  }, [imgPath]);

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
        if (!user?.id || type !== 'item' || isEditor) {
          // toast({
          //   title: 'Authentication',
          //   description:
          //     'Пожалуйста, авторизируйтесь через меню чтобы разместить заказ / Please login before order placement',
          //   status: 'info',
          //   duration: TOAST_DURATION,
          //   isClosable: true,
          // });
          return;
        }

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
      {loading && <Progress isIndeterminate size='xs' mb={2} />}

      <CardBody p={0}>
        <Stack direction='column' h='100%' spacing={6}>
          <Center
            position='relative'
            flexShrink={0}
            aspectRatio='1 / 1'
            w='100%'
            onClick={(e) => {
              if (type === 'item' && isEditor) {
                (e.currentTarget.firstChild as HTMLInputElement).click();
              }
            }}
          >
            {isEditor && type === 'item' && (
              <>
                <input
                  id={`card-image-picker-${id}`}
                  data-itemid={id}
                  style={{ position: 'absolute', top: 0, left: 0, zIndex: '-100', opacity: 0 }}
                  type='file'
                  multiple={false}
                  onChange={(e) => {
                    setLoading(true);

                    onImageChange(e).then(() =>
                      getDownloadURL(storageRef(strg, imgPath))
                        .then((url) => setImageURL(url))
                        .finally(() => setLoading(false)),
                    );
                  }}
                />

                <EditIcon boxSize={6} color='orange.400' position='absolute' top={2} right={2} zIndex={1} />
              </>
            )}

            <Image
              src={imageURL || noImage}
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
            {(!isEditor || type !== 'item') && (
              <Stack direction='column' spacing={2}>
                <Heading size='sm' textTransform='uppercase' color='telegram.200'>
                  {title}
                </Heading>

                {!!price && <Text fontSize='xs'>{VNpricer.format(+price)}</Text>}

                <Text
                  fontSize='xs'
                  color='chakra-subtle-text'
                  // className={cn(s.clamped, s.clamped_6)}
                >
                  {parse(description)}
                </Text>
              </Stack>
            )}

            {isEditor && type === 'item' && (
              <InputGroup size='sm' flexDirection='column' gap='4px'>
                <Input
                  placeholder='Title'
                  type='text'
                  defaultValue={title}
                  onChange={(e) => onEditValueDebounced(e, 'title', id)}
                />

                <Input
                  placeholder='Price'
                  type='number'
                  defaultValue={price}
                  onChange={(e) => onEditValueDebounced(e, 'price', id)}
                />

                <Textarea
                  placeholder='Description'
                  defaultValue={description.replace(/<br \/>/g, '\n')}
                  onChange={(e) => onEditValueDebounced(e, 'description', id)}
                  resize='none'
                  rows={12}
                />

                {pathname === '/service' && (
                  <Checkbox
                    size='lg'
                    defaultChecked={isActive}
                    onChange={(e) => {
                      set(ref(rtdb, `services/${parent}/categories/${id}`), e.target.checked).catch((err) =>
                        console.table(err),
                      );
                    }}
                  >
                    Активно
                  </Checkbox>
                )}
              </InputGroup>
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
                    removeCard(parent, id);
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
