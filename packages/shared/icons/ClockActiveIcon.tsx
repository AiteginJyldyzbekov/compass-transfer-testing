import React from 'react';

interface ClockActiveIconProps {
  className?: string;
}

const ClockActiveIcon: React.FC<ClockActiveIconProps> = ({ className = '' }) => {
  return (
    <svg 
      width="25" 
      height="24" 
      viewBox="0 0 25 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle 
        cx="12.1992" 
        cy="12" 
        r="7.25" 
        stroke="#0047FF" 
        strokeWidth="1.5"
      />
      <path 
        d="M12.1992 7.75V12L14.1992 14" 
        stroke="#0047FF" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ClockActiveIcon;
