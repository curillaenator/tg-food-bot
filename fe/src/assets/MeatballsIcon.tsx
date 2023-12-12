import React, { FC } from 'react';
import { Icon, type IconProps } from '@chakra-ui/react';

export const MeatballsIcon: FC<IconProps> = (props) => (
  <Icon width='24' height='24' viewBox='0 0 24 24' fill='none' {...props}>
    <circle cx='12' cy='12' r='1' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
    <circle cx='6' cy='12' r='1' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
    <circle cx='18' cy='12' r='1' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
  </Icon>
);
