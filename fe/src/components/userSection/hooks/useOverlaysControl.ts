import { useDisclosure } from '@chakra-ui/react';

export const useOverlaysControl = () => {
  const { isOpen: isAuthOpen, onOpen: onAuthOpen, onClose: onAuthClose } = useDisclosure();
  const { isOpen: isBasketOpen, onOpen: onBasketOpen, onClose: onBasketClose } = useDisclosure();
  const { isOpen: isMenuOpen, onOpen: onMenuOpen, onClose: onMenuClose } = useDisclosure();

  return {
    isMenuOpen,
    isAuthOpen,
    isBasketOpen,
    onAuthOpen,
    onBasketOpen,
    onAuthClose,
    onBasketClose,
    onMenuOpen,
    onMenuClose,
  };
};
