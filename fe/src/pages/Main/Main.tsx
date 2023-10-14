import React, { FC } from 'react';

import {
  // Button,
  Box,
  // Stack,
  // Flex,
  // Center,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';

export const Main: FC = () => {
  return (
    <Box as='main'>
      <Accordion>
        <AccordionItem py={8}>
          <h2 style={{ margin: '0 16px' }}>
            <AccordionButton
              // my={8}
              borderRadius={12}
              p={8}
              fontSize='3xl'
              fontWeight='extrabold'
              bg='telegram.200'
              color='gray.800'
              _hover={{
                backgroundColor: 'telegram.200',
              }}
            >
              <Box as='span' flex='1' textAlign='left'>
                Food
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>

          <AccordionPanel py={8} px={0} minH={400}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Error modi alias quidem aut architecto labore
            quibusdam necessitatibus voluptas tenetur consectetur quas, praesentium quia? Iure, exercitationem
            laudantium doloremque expedita debitis, voluptas voluptates placeat unde excepturi, quae aliquid dolorum?
            Distinctio est, qui modi facilis quasi labore reprehenderit quam necessitatibus vel repudiandae tempore
            sequi natus! Numquam, ab quas voluptatem ullam dolor voluptate ad hic cupiditate maxime obcaecati iure non
            sapiente corporis maiores voluptates quae doloribus quam culpa illum eum itaque reprehenderit nostrum
            accusantium laudantium. Architecto dolores sequi eaque voluptatem aut quos libero! Saepe modi consectetur
            illum similique iste sunt reprehenderit voluptatibus eaque? Necessitatibus.
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem py={8}>
          <h2 style={{ margin: '0 16px' }}>
            <AccordionButton
              borderRadius={12}
              p={8}
              fontSize='3xl'
              fontWeight='extrabold'
              bg='telegram.200'
              color='gray.800'
              _hover={{
                backgroundColor: 'telegram.200',
              }}
            >
              <Box as='span' flex='1' textAlign='left'>
                Emtertainments
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>

          <AccordionPanel py={8} px={0} minH={400}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};
