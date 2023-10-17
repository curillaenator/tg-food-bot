import React, { FC, useState, useEffect, useCallback } from 'react';
import { useStore } from 'effector-react';
import cn from 'classnames';
import { ref as storageRef, getDownloadURL, deleteObject } from 'firebase/storage';
import { ref, update, get, child } from 'firebase/database';

import { strg, rtdb } from '../../shared/firebase';

import {
  Flex,
  Stack,
  Image,
  Text,
  SimpleGrid,
  Heading,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

import { DeleteIcon } from '@chakra-ui/icons';

import { $globalStore } from '../../store';

import { Card } from '../card';

import s from './styles.module.scss';

export interface Category {
  id: string;
  title: string;
  description: string;
  imgPath: string;
  type?: string;
  parent?: string;
  adress?: string;
  categories?: Category[];
}

export const ShowcaseSection: FC<Category> = (props) => {
  const { id, imgPath, parent, title, description, type, categories } = props;
  const { isEditor } = useStore($globalStore);

  const [serviceImgUrl, setServiceImgUrl] = useState<string | undefined>(undefined);

  const removeService = useCallback(
    (e: React.MouseEvent<SVGElement, MouseEvent>) => {
      e.stopPropagation();
      e.preventDefault();

      if (confirm('Точно удалить сервис?')) {
        get(child(ref(rtdb), `services/${id}`)).then((snap) => {
          if (snap.exists()) {
            const linkedItems = Object.keys((snap.val() as Category).categories || {});
            const rtdbUpd = Object.fromEntries(linkedItems.map((itemId) => [`items/${itemId}`, null]));

            linkedItems.forEach((itemId) => deleteObject(storageRef(strg, `items/${itemId}`)));
            console.log('items images deleted');

            deleteObject(storageRef(strg, imgPath));
            console.log('service image deleted');

            update(ref(rtdb), {
              ...rtdbUpd,
              [`categories/${parent}/categories/${id}`]: null,
              [`services/${id}`]: null,
            });
            console.log('related records deleted');
          }
        });
      }
    },
    [id, parent, imgPath],
  );

  useEffect(() => {
    if (type !== 'service' || !imgPath) return;
    getDownloadURL(storageRef(strg, imgPath)).then((url) => setServiceImgUrl(url));
  }, [imgPath, type]);

  const menu = categories?.filter((c) => c.type === 'item' || !!c.categories) || [];

  return (
    <AccordionItem py={6}>
      <Heading as='h2' mx={4}>
        <AccordionButton
          as='button'
          borderRadius={12}
          px={4}
          py={2}
          fontSize='2xl'
          fontWeight='bold'
          bg='telegram.200'
          color='gray.800'
          _hover={{
            backgroundColor: 'telegram.200',
          }}
        >
          <Flex gap={2} flex={1} alignItems='center'>
            {isEditor && type === 'service' && (
              <DeleteIcon role='button' color='red' boxSize={6} onClick={removeService} />
            )}

            <Text textAlign='left' textTransform='capitalize'>
              {title}
            </Text>
          </Flex>

          <AccordionIcon />
        </AccordionButton>
      </Heading>

      <AccordionPanel px={4} pt={4} pb={0}>
        {type === 'service' && (
          <Stack w='full' pb={4}>
            <Image src={serviceImgUrl} alt={title} w='full' borderRadius={12} aspectRatio='3 / 1' objectFit='cover' />

            <Text color='chakra-subtle-text' className={cn(s.clamped, s.clamped_3)}>
              {description}
            </Text>

            {!!menu.length && (
              <Heading mt={4} fontSize='2xl'>
                Menu:
              </Heading>
            )}
          </Stack>
        )}

        <SimpleGrid columns={2} spacing={2}>
          {menu.map((category) => (
            <Card key={category.id} {...category} />
          ))}
        </SimpleGrid>
      </AccordionPanel>
    </AccordionItem>
  );
};
