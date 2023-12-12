import React, { FC } from 'react';
import { Icon, type IconProps } from '@chakra-ui/react';

export const MenuIcon: FC<IconProps> = (props) => (
  <Icon width='24' height='24' viewBox='0 0 24 24' fill='none' {...props}>
    <rect x='5' y='4' width='14' height='17' rx='2' stroke='currentColor' />
    <path d='M9 9H15' stroke='currentColor' strokeLinecap='round' />
    <path d='M9 13H15' stroke='currentColor' strokeLinecap='round' />
    <path d='M9 17H13' stroke='currentColor' strokeLinecap='round' />
  </Icon>
);
