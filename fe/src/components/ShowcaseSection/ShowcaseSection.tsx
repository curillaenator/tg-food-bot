import React, { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from 'effector-react';
import cn from 'classnames';

import {
  Center,
  Flex,
  Stack,
  Image,
  Text,
  SimpleGrid,
  Heading,
  Button,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

import { DeleteIcon, PlusSquareIcon } from '@chakra-ui/icons';
import { Card } from '../card';

import { useShowcase } from './hooks/useShowcase';
import { $globalStore } from '../../store';

import type { ShowcaseSectionProps } from './interfaces';
import s from './styles.module.scss';

export const ShowcaseSection: FC<ShowcaseSectionProps> = (props) => {
  const { id, parent, title, description, type, categories, onMenuAdd, onMenuItemRemove } = props;
  const { pathname } = useLocation();

  const { isEditor, user } = useStore($globalStore);

  const { serviceImgUrl, removeService } = useShowcase(props);

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
            {isEditor && (user?.role === 'admin' || user?.role === 'manager') && type === 'service' && (
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
            <Card key={category.id} {...category} onMenuItemRemove={onMenuItemRemove} />
          ))}

          {parent && !!onMenuAdd && pathname === '/service' && (
            <Center>
              <Button size='lg' variant='solid' w='full' onClick={() => onMenuAdd(id)} rightIcon={<PlusSquareIcon />}>
                Добавить
              </Button>
            </Center>
          )}
        </SimpleGrid>
      </AccordionPanel>
    </AccordionItem>
  );
};
