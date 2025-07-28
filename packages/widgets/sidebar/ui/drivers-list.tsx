'use client';

import React from 'react';
import { Button } from '@shared/ui/forms/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@shared/ui/modals/tooltip';
import type { SidebarDriver } from '../hooks/use-drivers';

interface DriversListProps {
  drivers: SidebarDriver[];
  loading: boolean;
  error: string | null;
  onDriverClick: (driver: SidebarDriver) => void;
}

const DriverItem = React.memo(({ driver, onDriverClick }: {
  driver: SidebarDriver;
  onDriverClick: (driver: SidebarDriver) => void;
}) => (
  <div key={driver.id} className='group/menu-item relative flex items-center gap-2'>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className='peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! group-data-[collapsible=icon]:justify-center [&>span:last-child]:truncate group-data-[collapsible=icon]:[&>span]:hidden [&>svg]:size-4 [&>svg]:shrink-0 h-8 text-sm cursor-pointer'>
          <div className='w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0'>
            {driver.name
              .split(' ')
              .map(n => n[0])
              .join('')}
          </div>
          <div className='flex-1 min-w-0 group-data-[collapsible=icon]:hidden'>
            <div className='flex flex-row justify-between items-center gap-1 mb-1'>
              <p className='text-xs font-medium text-sidebar-foreground truncate'>
                {driver.name}
              </p>
              <span className='text-xs text-sidebar-foreground border rounded-sm shadow-sm px-1 py-0.5 font-mono bg-white/50 flex-shrink-0'>
                {driver.carNumber}
              </span>
            </div>
            <div className='text-xs text-sidebar-foreground/70 truncate'>
              {driver.phone}
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent
        side='right'
        align='center'
        className='p-4 bg-white border border-gray-200 shadow-lg'
      >
        <div className='space-y-3 min-w-[200px]'>
          <div className='flex items-center space-x-3'>
            <div className='w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-medium'>
              {driver.name
                .split(' ')
                .map(n => n[0])
                .join('')}
            </div>
            <div className='flex-1'>
              <h3 className='text-xl font-semibold text-gray-900'>{driver.name}</h3>
              <p className='text-xs text-gray-500'>Водитель</p>
            </div>
            <Button
              size='sm'
              variant='outline'
              className='h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-300 text-blue-600 border-blue-300'
              onClick={() => onDriverClick(driver)}
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
                />
              </svg>
            </Button>
          </div>
          <div className='space-y-2 pt-2 border-t border-gray-100'>
            <div className='flex items-center space-x-2'>
              <div className='w-4 h-4 text-gray-400'>
                <svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                  />
                </svg>
              </div>
              <span className='text-sm text-gray-700'>{driver.phone}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-4 h-4 text-gray-400'>
                <svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <span className='text-sm text-gray-700 font-mono'>
                {driver.carNumber}
              </span>
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  </div>
));

DriverItem.displayName = 'DriverItem';

export const DriversList = React.memo(({ drivers, loading, error, onDriverClick }: DriversListProps) => {
  if (loading) {
    return (
      <div className='text-xs text-sidebar-foreground/70 p-2'>
        Загрузка водителей...
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-xs text-red-500 p-2'>
        Ошибка: {error}
      </div>
    );
  }

  if (drivers.length === 0) {
    return (
      <div className='text-xs text-sidebar-foreground/70 p-2 text-center'>
        Водителей онлайн нет
      </div>
    );
  }

  return (
    <>
      {drivers.map(driver => (
        <DriverItem
          key={driver.id}
          driver={driver}
          onDriverClick={onDriverClick}
        />
      ))}
    </>
  );
});

DriversList.displayName = 'DriversList';
