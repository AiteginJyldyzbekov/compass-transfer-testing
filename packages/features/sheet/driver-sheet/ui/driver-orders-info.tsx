'use client';

import React from 'react';

interface DriverOrdersInfoProps {
  activeOrderType: string;
  setActiveOrderType: (type: string) => void;
}

export function DriverOrdersInfo({ activeOrderType, setActiveOrderType }: DriverOrdersInfoProps) {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Заказы</h3>

      {/* Переключатели типов заказов */}
      <div className='flex gap-2 p-1 bg-muted rounded-lg'>
        <button
          onClick={() => setActiveOrderType('scheduled')}
          className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
            activeOrderType === 'scheduled'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Запланированные
        </button>
        <button
          onClick={() => setActiveOrderType('active')}
          className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
            activeOrderType === 'active'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Активные
        </button>
        <button
          onClick={() => setActiveOrderType('completed')}
          className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
            activeOrderType === 'completed'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Завершенные
        </button>
      </div>

      {/* Контент для запланированных заказов */}
      {activeOrderType === 'scheduled' && (
        <div className='space-y-3'>
          <div className='p-4 rounded-lg border bg-green-50 border-green-200'>
            <div className='flex items-center justify-between mb-2'>
              <h4 className='font-medium text-green-800'>Заказ #1234</h4>
              <span className='text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded'>
                Запланирован
              </span>
            </div>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Дата:</span>
                <span className='font-medium'>15.12.2024</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Время:</span>
                <span className='font-medium'>14:30</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Маршрут:</span>
                <span className='font-medium'>Аэропорт → Центр города</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Стоимость:</span>
                <span className='font-medium text-green-600'>1500 сом</span>
              </div>
            </div>
          </div>

          <div className='p-4 rounded-lg border bg-blue-50 border-blue-200'>
            <div className='flex items-center justify-between mb-2'>
              <h4 className='font-medium text-blue-800'>Заказ #1235</h4>
              <span className='text-sm text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded'>
                Запланирован
              </span>
            </div>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Дата:</span>
                <span className='font-medium'>16.12.2024</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Время:</span>
                <span className='font-medium'>09:00</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Маршрут:</span>
                <span className='font-medium'>Отель → Железнодорожный вокзал</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Стоимость:</span>
                <span className='font-medium text-blue-600'>800 сом</span>
              </div>
            </div>
          </div>

          <div className='text-center p-4'>
            <p className='text-sm text-muted-foreground'>
              Всего запланировано заказов: <span className='font-medium'>2</span>
            </p>
          </div>
        </div>
      )}

      {/* Контент для активных заказов */}
      {activeOrderType === 'active' && (
        <div className='space-y-3'>
          <div className='p-4 rounded-lg border bg-orange-50 border-orange-200'>
            <div className='flex items-center justify-between mb-2'>
              <h4 className='font-medium text-orange-800'>Заказ #1237</h4>
              <span className='text-sm text-orange-600 font-medium bg-orange-100 px-2 py-1 rounded'>
                В пути
              </span>
            </div>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Время начала:</span>
                <span className='font-medium'>13:15</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Маршрут:</span>
                <span className='font-medium'>Центр города → Аэропорт</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Прогресс:</span>
                <span className='font-medium text-orange-600'>65%</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Стоимость:</span>
                <span className='font-medium text-orange-600'>1200 сом</span>
              </div>
            </div>
          </div>

          <div className='text-center p-4'>
            <p className='text-sm text-muted-foreground'>
              Активных заказов: <span className='font-medium'>1</span>
            </p>
          </div>
        </div>
      )}

      {/* Контент для завершенных заказов */}
      {activeOrderType === 'completed' && (
        <div className='space-y-3'>
          <div className='p-4 rounded-lg border bg-gray-50 border-gray-200'>
            <div className='flex items-center justify-between mb-2'>
              <h4 className='font-medium text-gray-800'>Заказ #1230</h4>
              <span className='text-sm text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded'>
                Завершен
              </span>
            </div>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Дата:</span>
                <span className='font-medium'>14.12.2024</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Время:</span>
                <span className='font-medium'>10:30 - 11:15</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Маршрут:</span>
                <span className='font-medium'>Аэропорт → Отель</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Стоимость:</span>
                <span className='font-medium text-gray-600'>1000 сом</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Рейтинг:</span>
                <span className='font-medium text-yellow-600'>⭐⭐⭐⭐⭐</span>
              </div>
            </div>
          </div>

          <div className='p-4 rounded-lg border bg-gray-50 border-gray-200'>
            <div className='flex items-center justify-between mb-2'>
              <h4 className='font-medium text-gray-800'>Заказ #1229</h4>
              <span className='text-sm text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded'>
                Завершен
              </span>
            </div>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Дата:</span>
                <span className='font-medium'>13.12.2024</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Время:</span>
                <span className='font-medium'>15:00 - 15:45</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Маршрут:</span>
                <span className='font-medium'>ТЦ Дордой → Центр города</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Стоимость:</span>
                <span className='font-medium text-gray-600'>600 сом</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Рейтинг:</span>
                <span className='font-medium text-yellow-600'>⭐⭐⭐⭐</span>
              </div>
            </div>
          </div>

          <div className='text-center p-4'>
            <p className='text-sm text-muted-foreground'>
              Завершенных заказов: <span className='font-medium'>2</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
