import React from 'react';
import type { IconProps } from '@shared/icons';
const ProfileCardIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
    >
      <path d="M4 4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2H4zm16 12V6H4v12h16z" />
      <path d="M12 11a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm-4.5 4a.5.5 0 01.5-.5h8a.5.5 0 010 1h-8a.5.5 0 01-.5-.5zm0 2a.5.5 0 01.5-.5h8a.5.5 0 010 1h-8a.5.5 0 01-.5-.5z" />
      <path fillRule="evenodd" d="M12 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM9.5 10a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0z" clipRule="evenodd" />
      <path d="M9 14a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z" />
    </svg>
  );
};

export default ProfileCardIcon;
