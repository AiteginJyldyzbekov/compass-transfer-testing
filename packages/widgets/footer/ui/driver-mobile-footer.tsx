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
    <footer className='fixed bottom-0 left-0 right-0 bg-[#F9F9F9] mx-2 mb-1 rounded-2xl shadow-md z-50 safe-area-bottom ios-footer'>
      <div className='flex justify-around items-center py-2 px-1 max-w-screen-sm mx-auto'>
        {driverMobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <button
              key={item.id}
                             className={`relative flex items-center justify-center p-2 rounded-xl transition-all duration-200 min-w-0 flex-1 touch-manipulation ${
                isActive
                  ? 'text-blue-500 bg-blue-50 scale-105'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 active:scale-95'
              }`}
              onClick={() => item.href && handleNavigation(item.href)}
              aria-label={`Навигация ${item.id}`}
            >
                             {isActive && item.activeIcon ? (
                 <item.activeIcon className="h-5 w-5 sm:h-4 sm:w-4 scale-110 transition-transform" />
               ) : (
                 <item.icon className={`h-5 w-5 sm:h-4 sm:w-4 transition-transform ${isActive ? 'scale-110' : ''}`} />
               )}
              
              {/* Badge для уведомлений */}
              {item.id === 'notifications' && unreadCount > 0 && (
                                 <div className='absolute top-0 right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1'>
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
