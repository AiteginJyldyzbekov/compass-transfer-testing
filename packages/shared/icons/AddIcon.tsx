import React from 'react';
import type { IconProps } from './types';

const AddIcon: React.FC<IconProps> = ({ size = 57, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 57 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30.0403 11.6507C30.0403 10.6851 29.2576 9.90234 28.2919 9.90234C27.3263 9.90234 26.5435 10.6851 26.5435 11.6507V26.2208H11.9735C11.0079 26.2208 10.2251 27.0036 10.2251 27.9692C10.2251 28.9348 11.0079 29.7176 11.9735 29.7176H26.5435V44.2876C26.5435 45.2532 27.3263 46.036 28.2919 46.036C29.2576 46.036 30.0403 45.2532 30.0403 44.2876V29.7176H44.6104C45.576 29.7176 46.3588 28.9348 46.3588 27.9692C46.3588 27.0036 45.576 26.2208 44.6104 26.2208H30.0403V11.6507Z"
        fill="white"
      />
    </svg>
  );
};

export default AddIcon;
