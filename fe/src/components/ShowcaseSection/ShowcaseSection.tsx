import React, { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from 'effector-react';
// import cn from 'classnames';

import {
  Center,
  Flex,
  Stack,
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
import { ServiceImage, ServiceDescription } from './components';

import { useShowcase } from './hooks/useShowcase';
import { $globalStore } from '../../store';

import type { ShowcaseSectionProps } from './interfaces';
// import s from './styles.module.scss';

export const ShowcaseSection: FC<ShowcaseSectionProps> = (props) => {
  const { id, parent, imgPath, title, description, type, categories, onMenuAdd, onMenuItemRemove } = props;
  const { pathname } = useLocation();

  const { isEditor, user } = useStore($globalStore);

  const { serviceImgUrl, removeService, setServiceImgUrl } = useShowcase(props);

  const menu = categories?.filter((c) => c.type === 'item' || !!c.categories) || [];

  return (
    <AccordionItem py={6}>
      <Heading as='h2' mx={4} display='flex' flexDirection='column' gap={2}>
        {type === 'service' && (
          <ServiceImage
            serviceImgUrl={serviceImgUrl}
            title={title}
            isEditor={isEditor}
            serviceId={id}
            imgPath={imgPath}
            setServiceImgUrl={setServiceImgUrl}
          />
        )}

        <AccordionButton
          as='button'
          borderRadius={8}
          px={4}
          py={2}
          fontSize='xl'
          fontWeight='semibold'
          bg='telegram.200'
          color='gray.800'
          _hover={{
            backgroundColor: 'telegram.200',
          }}
        >
          <Flex gap={2} flex={1} alignItems='center'>
            {isEditor && user?.role === 'admin' && type === 'service' && (
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
            <ServiceDescription description={description} serviceId={id} isEditor={isEditor} />

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
