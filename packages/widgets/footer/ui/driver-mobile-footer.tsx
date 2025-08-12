'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { driverMobileNavItems } from '../config/nav-items';

export function DriverMobileFooter() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <footer className='bg-[#F9F9F9] safe-area-bottom mx-2 mb-2 rounded-2xl shadow-md'>
      <div className='flex justify-around items-center py-3 px-1'>
        {driverMobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <button
              key={item.id}
              className={`flex items-center justify-center p-3 rounded-xl transition-all duration-200 min-w-0 flex-1 touch-manipulation ${
                isActive
                  ? 'text-blue-600 bg-blue-50 scale-105'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 active:scale-95'
              }`}
              onClick={() => item.href && handleNavigation(item.href)}
              aria-label={`Навигация ${item.id}`}
            >
              <item.icon className={`h-6 w-6 sm:h-5 sm:w-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
            </button>
          );
        })}
      </div>
    </footer>
  );
}
