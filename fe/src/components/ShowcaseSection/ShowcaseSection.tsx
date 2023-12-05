import React, { FC, useRef } from 'react';
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
import { ServiceImage, ServiceDescription, ServiceAdress } from './components';

import { useShowcase } from './hooks/useShowcase';
import { $globalStore } from '../../store';

import type { ShowcaseSectionProps } from './interfaces';
// import s from './styles.module.scss';

export const ShowcaseSection: FC<ShowcaseSectionProps> = (props) => {
  const { id, parent, imgPath, title, description, adress, type, categories = [], onMenuAdd, onMenuItemRemove } = props;
  const { pathname } = useLocation();

  const { isEditor, user } = useStore($globalStore);

  const { serviceImgUrl, removeService, setServiceImgUrl } = useShowcase(props);

  const openButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <AccordionItem py={4}>
      <Stack
        mx={4}
        gap={0}
        onClick={() => {
          if (openButtonRef.current && !isEditor) openButtonRef.current.click();
        }}
      >
        <ServiceImage
          type={type}
          serviceImgUrl={serviceImgUrl}
          title={title}
          isEditor={isEditor}
          serviceId={id}
          imgPath={imgPath}
          setServiceImgUrl={setServiceImgUrl}
        />

        <AccordionButton
          ref={openButtonRef}
          as='button'
          h={type === 'category' ? '24px' : '32px'}
          borderRadius='0 0 8px 8px'
          px={2}
          py={0}
          fontSize='md'
          fontWeight='medium'
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

            {type !== 'category' && <Text textAlign='left'>{title}</Text>}
          </Flex>

          <AccordionIcon />
        </AccordionButton>
      </Stack>

      <AccordionPanel px={4} pt={4} pb={0}>
        {type === 'service' && (
          <Stack w='full' pb={4}>
            <ServiceAdress serviceId={id} adress={adress} isEditor={isEditor} />

            <ServiceDescription description={description} serviceId={id} isEditor={isEditor} />

            {!!categories.length && (
              <Heading mt={4} fontSize='xl'>
                Menu:
              </Heading>
            )}
          </Stack>
        )}

        <SimpleGrid columns={2} spacing={2}>
          {categories.map((category) => (
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
