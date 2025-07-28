'use client';

import { Edit } from 'lucide-react';
import { Button } from '@shared/ui/forms/button';

interface Driver {
  id: string;
  name: string;
  phone: string;
  carNumber: string;
}

interface DriverMainInfoProps {
  driver: Driver;
}

export function DriverMainInfo({ driver }: DriverMainInfoProps) {
  return (
    <div className='space-y-4'>
      <div className='flex items-center space-x-4 p-4 rounded-lg border bg-blue-50 border-blue-200 hover:bg-blue-100 dark:bg-blue-950 dark:border-blue-800 dark:hover:bg-blue-900'>
        <div className='w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-medium'>
          {driver.name
            .split(' ')
            .map(n => n[0])
            .join('')}
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>
            {driver.name}
          </h3>
          <p className='text-sm text-muted-foreground'>Водитель</p>
        </div>
        <Button
          size='sm'
          variant='outline'
          className='hover:bg-blue-50 hover:border-blue-300 text-blue-600 border-blue-300'
          onClick={() => {
            // Переход на страницу редактирования водителя
            window.open(`/drivers/${driver.id}/edit`, '_blank');
          }}
        >
          <Edit className='h-4 w-4 mr-2' />
          Редактировать
        </Button>
      </div>

      <div className='space-y-3'>
        <div className='p-4 rounded-lg border bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-950 dark:border-green-800 dark:hover:bg-green-900'>
          <div className='flex items-center space-x-3'>
            <div className='w-5 h-5 text-green-600 dark:text-green-400'>
              <svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                />
              </svg>
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm text-muted-foreground'>Телефон</p>
              <p className='font-medium text-foreground'>{driver.phone}</p>
            </div>
          </div>
        </div>

        <div className='p-4 rounded-lg border bg-yellow-50 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-950 dark:border-yellow-800 dark:hover:bg-yellow-900'>
          <div className='flex items-center space-x-3'>
            <div className='w-5 h-5 text-yellow-600 dark:text-yellow-400'>
              <svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm text-muted-foreground'>Номер машины</p>
              <p className='font-medium text-foreground font-mono'>
                {driver.carNumber}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='p-4 rounded-lg border bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-950 dark:border-gray-800 dark:hover:bg-gray-900'>
        <h4 className='font-medium text-foreground mb-3'>
          Дополнительная информация
        </h4>
        <div className='space-y-2 text-sm text-muted-foreground'>
          <p>• Водитель активен и доступен для заказов</p>
          <p>• Рейтинг: ⭐⭐⭐⭐⭐ (5.0)</p>
          <p>• Завершено заказов: 127</p>
          <p>• Стаж работы: 2 года 3 месяца</p>
        </div>
      </div>
    </div>
  );
}
