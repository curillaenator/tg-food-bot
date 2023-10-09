import { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fullwidth?: boolean;
  size?: 's' | 'l';
}
