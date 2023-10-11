import React from 'react';
import type { IconProps } from '../interfaces';

export const PlusIcon: React.FC<IconProps> = ({ className }) => {
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
        d='m12.002 2c5.518 0 9.998 4.48 9.998 9.998 0 5.517-4.48 9.997-9.998 9.997-5.517 0-9.997-4.48-9.997-9.997 0-5.518 4.48-9.998 9.997-9.998zm0 1.5c-4.69 0-8.497 3.808-8.497 8.498s3.807 8.497 8.497 8.497 8.498-3.807 8.498-8.497-3.808-8.498-8.498-8.498zm-.747 7.75h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z'
        fillRule='nonzero'
        fill='currentColor'
      />
    </svg>
  );
};
