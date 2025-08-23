import React from 'react';
import type { IconProps } from './types';

interface CreditCardIconProps extends IconProps {
  isActive?: boolean;
}

const CreditCardIcon: React.FC<CreditCardIconProps> = ({ className = '', isActive = false }) => {
  const fillColor = isActive ? 'white' : '#0866FF';

  return (
    <svg
      width="93"
      height="71"
      className={className}
      viewBox="0 0 93 71"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_201_2410)">
        <path
          d="M16.375 -0.25H76.4167C80.7596 -0.25 84.9246 1.47522 87.9956 4.54613C91.0665 7.61704 92.7917 11.7821 92.7917 16.125V54.3333C92.7917 58.6763 91.0665 62.8413 87.9956 65.9122C84.9246 68.9831 80.7596 70.7083 76.4167 70.7083H16.375C12.0321 70.7083 7.86703 68.9831 4.79613 65.9122C1.72522 62.8413 0 58.6763 0 54.3333V16.125C0 11.7821 1.72522 7.61704 4.79613 4.54613C7.86703 1.47522 12.0321 -0.25 16.375 -0.25ZM16.375 5.20833C13.4797 5.20833 10.703 6.35848 8.65575 8.40575C6.60848 10.453 5.45833 13.2297 5.45833 16.125H87.3333C87.3333 13.2297 86.1832 10.453 84.1359 8.40575C82.0887 6.35848 79.312 5.20833 76.4167 5.20833H16.375ZM5.45833 54.3333C5.45833 57.2286 6.60848 60.0053 8.65575 62.0526C10.703 64.0999 13.4797 65.25 16.375 65.25H76.4167C79.312 65.25 82.0887 64.0999 84.1359 62.0526C86.1832 60.0053 87.3333 57.2286 87.3333 54.3333V32.5H5.45833V54.3333ZM16.375 48.875H32.75V54.3333H16.375V48.875ZM43.6667 48.875H54.5833V54.3333H43.6667V48.875ZM5.45833 21.5833V27.0417H87.3333V21.5833H5.45833Z"
          fill={fillColor}
        />
      </g>
      <defs>
        <clipPath id="clip0_201_2410">
          <rect width="93" height="71" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default CreditCardIcon;
