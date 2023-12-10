import React, { FC } from 'react';
import { NavLink as ReactRouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'effector-react';

import {
  Text,
  Drawer,
  Link as ChakraLink,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
} from '@chakra-ui/react';

import { ChevronLeftIcon } from '@chakra-ui/icons';

import { $globalStore } from '../../store';

import s from './styles.module.scss';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: FC<SidebarProps> = (props) => {
  const { isOpen, onClose } = props;

  const navigate = useNavigate();

  const { sidebar } = useStore($globalStore);

  return (
    <Drawer size='full' isOpen={isOpen} placement='left' onClose={onClose}>
      <DrawerOverlay />

      <DrawerContent className={s.authBg}>
        <DrawerCloseButton size='lg' h='fit-content' px={2} py={4} color='white' top={4} right={4} />

        <DrawerHeader
          p={4}
          bg='var(--color-bg-cutom)'
          borderRadius='0 0 16px 0'
          borderBottom='1px solid var(--pixpax-colors-whiteAlpha-400)'
        >
          <Button
            leftIcon={<ChevronLeftIcon boxSize={8} />}
            variant='ghost'
            size='md'
            p={0}
            h='48px'
            onClick={() => {
              navigate('/');
              onClose();
            }}
          >
            Главная
          </Button>
        </DrawerHeader>

        <DrawerBody p={4} as='nav'>
          <Accordion allowMultiple defaultIndex={[0, 1, 2, 3, 4, 5, 6, 7]}>
            {Object.keys(sidebar).map((categoryName) => (
              <AccordionItem key={categoryName}>
                <AccordionButton w='full' justifyContent='space-between'>
                  <Text as='h3' fontWeight={800} fontSize='xl' textAlign='left' textTransform='capitalize'>
                    {categoryName}
                  </Text>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel p={2} className={s.link} m={0}>
                  {sidebar[categoryName].map(({ id, to, title }) => (
                    <ChakraLink
                      key={id}
                      display='block'
                      id={id}
                      lineHeight='32px'
                      color='telegram.200'
                      size='sm'
                      variant='ghost'
                      as={ReactRouterLink}
                      to={to}
                      justifyContent='flex-start'
                      onClick={onClose}
                      px={2}
                      borderRadius='8px'
                    >
                      {title}
                    </ChakraLink>
                  ))}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
