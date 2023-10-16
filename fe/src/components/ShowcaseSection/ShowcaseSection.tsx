import React, { FC } from 'react';

import {
  Box,
  SimpleGrid,
  Heading,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

import { Card } from '../card';

export interface Category {
  id: string;
  title: string;
  description: string;
  imgPath: string;
  categories?: Category[];
  type?: string;
}

export const ShowcaseSection: FC<Category> = (props) => {
  const {
    // id,
    // imgPath,
    title,
    // type,
    categories,
  } = props;

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

      <AccordionPanel px={4} pt={6} pb={0}>
        <SimpleGrid columns={2} spacing={2}>
          {categories
            ?.filter((c) => c.type === 'item' || !!c.categories)
            .map((category) => <Card key={category.id} {...category} />)}
        </SimpleGrid>
      </AccordionPanel>
    </AccordionItem>
  );
};
