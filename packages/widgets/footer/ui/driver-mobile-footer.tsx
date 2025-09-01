'use client';

import { useRouter, usePathname } from 'next/navigation';
import React from 'react';
import { useNotificationsContext } from '@features/notifications';
import { driverMobileNavItems } from '../config/nav-items';

export function DriverMobileFooter() {
  const router = useRouter();
  const pathname = usePathname();
  const { unreadCount } = useNotificationsContext();

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <footer className='fixed bottom-0 left-0 right-0 bg-[#F9F9F9] mx-2 mb-2 rounded-2xl shadow-md z-50'>
      <div className='flex justify-around items-center py-3 px-1 max-w-screen-sm mx-auto'>
        {driverMobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <button
              key={item.id}
                             className={`relative flex items-center justify-center p-3 rounded-xl transition-all duration-200 min-w-0 flex-1 touch-manipulation ${
                isActive
                  ? 'text-blue-500 bg-blue-50 scale-105'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 active:scale-95'
              }`}
              onClick={() => item.href && handleNavigation(item.href)}
              aria-label={`Навигация ${item.id}`}
            >
                             {isActive && item.activeIcon ? (
                 <item.activeIcon className="h-6 w-6 sm:h-5 sm:w-5 scale-110 transition-transform" />
               ) : (
                 <item.icon className={`h-6 w-6 sm:h-5 sm:w-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
               )}
              
              {/* Badge для уведомлений */}
              {item.id === 'notifications' && unreadCount > 0 && (
                                 <div className='absolute top-0 right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1.5'>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </footer>
  );
}
