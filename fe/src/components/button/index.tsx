import React, { forwardRef } from 'react';
import cn from 'classnames';

import s from './styles.module.scss';

import type { ButtonProps } from './interfaces';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { children, fullwidth, size = 's', ...rest } = props;

  return (
    <button
      {...rest}
      ref={ref}
      className={cn(s.button, s[`_size_${size}`], {
        [s.fullwidth]: fullwidth,
      })}
    >
      {children}
    </button>
  );
});
