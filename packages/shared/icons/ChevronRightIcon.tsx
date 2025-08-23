import React from 'react';
import type { IconProps } from '@shared/icons';
const ChevronRightIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => {
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
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
};

export default ChevronRightIcon;
