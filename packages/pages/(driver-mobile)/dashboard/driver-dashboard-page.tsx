'use client';

import React from 'react';
import { DriverStatusCard } from './components/driver-status-card';

export function DriverDashboardPage() {
  return (
    <div className='h-full flex flex-col p-4'>
      {/* Заголовок */}
      <div className='mb-4'>
        <h1 className='text-2xl font-bold text-gray-900'>
          Дашборд
        </h1>
      </div>
      
      {/* Карточка статуса водителя на всю оставшуюся высоту */}
      <div className='flex-1 min-h-0'>
        <DriverStatusCard />
      </div>
    </div>
  );
}
