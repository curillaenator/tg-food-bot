import React, { FC } from 'react';
import { Icon, type IconProps } from '@chakra-ui/react';

export const MessageIcon: FC<IconProps> = (props) => (
  <Icon width='24' height='24' viewBox='0 0 24 24' {...props}>
    <rect x='4' y='6' width='16' height='12' rx='2' stroke='currentColor' />
    <path d='M4 9L11.1056 12.5528C11.6686 12.8343 12.3314 12.8343 12.8944 12.5528L20 9' stroke='currentColor' />
  </Icon>
);
