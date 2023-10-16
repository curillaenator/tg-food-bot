import { useDisclosure } from '@chakra-ui/react';

export const useOverlaysControl = () => {
  const { isOpen: isAuthOpen, onOpen: onAuthOpen, onClose: onAuthClose } = useDisclosure();
  const { isOpen: isBasketOpen, onOpen: onBasketOpen, onClose: onBasketClose } = useDisclosure();

  return {
    isAuthOpen,
    isBasketOpen,
    onAuthOpen,
    onBasketOpen,
    onAuthClose,
    onBasketClose,
  };
};
