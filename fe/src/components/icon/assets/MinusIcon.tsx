import React from 'react';
import type { IconProps } from '../interfaces';

export const MinusIcon: React.FC<IconProps> = ({ className }) => {
  return (
    <svg
      width={56}
      height={56}
      clipRule='evenodd'
      fillRule='evenodd'
      strokeLinejoin='round'
      strokeMiterlimit='2'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm4.253 7.75h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z'
        fillRule='nonzero'
        fill='currentColor'
      />
    </svg>
  );
};
