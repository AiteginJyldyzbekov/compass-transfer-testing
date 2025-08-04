'use client';

import { useState } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-3 z-50';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-3 z-50';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-3 z-50';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-3 z-50';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-3 z-50';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800';
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-800';
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-800';
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-800';
      default:
        return 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-800';
    }
  };

  return (
    <div
      className='relative inline-block'
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-3 pointer-events-none' style={{ zIndex: 99999 }}>
          {/* Tooltip content */}
          <div className='bg-black text-white px-4 py-3 rounded-xl shadow-2xl border-2 border-white/20 animate-in fade-in-0 zoom-in-95 duration-200'>
            <span className='text-sm font-medium italic whitespace-nowrap'>
              {content}
            </span>
          </div>

          {/* Arrow */}
          <div
            className='absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-l-transparent border-r-transparent border-b-transparent border-t-black'
          />
        </div>
      )}
    </div>
  );
}
