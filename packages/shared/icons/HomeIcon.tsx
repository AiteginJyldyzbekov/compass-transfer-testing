import React from 'react';

interface HomeIconProps {
  className?: string;
}

const HomeIcon: React.FC<HomeIconProps> = ({ className = '' }) => {
  return (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M5.25 16.88V10.9146C5.25 10.3375 5.51642 9.79278 5.97193 9.4385L10.8519 5.64294C11.5272 5.11773 12.4728 5.11773 13.1481 5.64294L18.0281 9.4385C18.4836 9.79278 18.75 10.3375 18.75 10.9146V16.88C18.75 17.9128 17.9128 18.75 16.88 18.75H7.12C6.08723 18.75 5.25 17.9128 5.25 16.88Z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M14.25 14.25C14.0657 14.694 13.7535 15.0735 13.353 15.3405C12.9525 15.6075 12.4817 15.75 12 15.75C11.5183 15.75 11.0475 15.6075 10.647 15.3405C10.2465 15.0735 9.93433 14.694 9.75 14.25" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default HomeIcon;
