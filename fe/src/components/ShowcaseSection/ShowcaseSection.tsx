import React, { FC, useState, useEffect } from 'react';
import cn from 'classnames';
import { ref, getDownloadURL } from 'firebase/storage';

import { strg } from '../../shared/firebase';

import {
  Box,
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
  const {
    // id,
    imgPath,
    title,
    description,
    type,
    categories,
  } = props;

  const [serviceImgUrl, setServiceImgUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (type !== 'service' || !imgPath) return;
    getDownloadURL(ref(strg, imgPath)).then((url) => setServiceImgUrl(url));
  }, [imgPath, type]);

  const menu = categories?.filter((c) => c.type === 'item' || !!c.categories) || [];

  return (
    <AccordionItem py={6}>
      <Heading as='h2' mx={4}>
        <AccordionButton
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
          <Box as='span' flex='1' textAlign='left' textTransform='capitalize'>
            {title}
          </Box>
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
