import React from 'react';
import type { IconProps } from '@shared/icons';
const ChevronsLeftIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
    >
      <path d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
  );
};

export default ChevronsLeftIcon;
