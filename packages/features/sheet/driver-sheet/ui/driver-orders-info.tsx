'use client';

import React from 'react';
import type { GetDriverDTO } from '@entities/users/interface';
import { useDriverOrders } from '../hooks/use-driver-orders';
import { orderStatusLabels } from '@entities/orders/constants/order-status-labels';

interface DriverOrdersInfoProps {
  driver: GetDriverDTO;
  activeOrderType: string;
  setActiveOrderType: (type: string) => void;
}

export function DriverOrdersInfo({ driver, activeOrderType, setActiveOrderType }: DriverOrdersInfoProps) {
  const { orders, loading, error } = useDriverOrders(driver.id);

  if (loading) {
    return (
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Заказы</h3>
        <div className='flex items-center justify-center p-8'>
          <div className='text-muted-foreground'>Загрузка заказов...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold'>Заказы</h3>
        <div className='flex items-center justify-center p-8'>
          <div className='text-red-500'>Ошибка загрузки: {error}</div>
        </div>
      </div>
    );
  }

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
          {orders.scheduled.length > 0 ? (
            <>
              {orders.scheduled.map((order) => (
                <div key={order.id} className='p-4 rounded-lg border bg-green-50 border-green-200'>
                  <div className='flex items-center justify-between mb-2'>
                    <h4 className='font-medium text-green-800'>Заказ #{order.id.slice(-8)}</h4>
                    <span className='text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded'>
                      {orderStatusLabels[order.status]}
                    </span>
                  </div>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Дата создания:</span>
                      <span className='font-medium'>
                        {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Время:</span>
                      <span className='font-medium'>
                        {new Date(order.createdAt).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Тип:</span>
                      <span className='font-medium'>{order.type}</span>
                    </div>
                    {order.totalPrice && (
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Стоимость:</span>
                        <span className='font-medium text-green-600'>{order.totalPrice} сом</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className='text-center p-4'>
                <p className='text-sm text-muted-foreground'>
                  Всего запланировано заказов: <span className='font-medium'>{orders.scheduled.length}</span>
                </p>
              </div>
            </>
          ) : (
            <div className='text-center p-8'>
              <p className='text-muted-foreground'>Нет запланированных заказов</p>
            </div>
          )}
        </div>
      )}

      {/* Контент для активных заказов */}
      {activeOrderType === 'active' && (
        <div className='space-y-3'>
          {orders.active.length > 0 ? (
            <>
              {orders.active.map((order) => (
                <div key={order.id} className='p-4 rounded-lg border bg-orange-50 border-orange-200'>
                  <div className='flex items-center justify-between mb-2'>
                    <h4 className='font-medium text-orange-800'>Заказ #{order.id.slice(-8)}</h4>
                    <span className='text-sm text-orange-600 font-medium bg-orange-100 px-2 py-1 rounded'>
                      {orderStatusLabels[order.status]}
                    </span>
                  </div>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Время создания:</span>
                      <span className='font-medium'>
                        {new Date(order.createdAt).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Тип:</span>
                      <span className='font-medium'>{order.type}</span>
                    </div>
                    {order.totalPrice && (
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Стоимость:</span>
                        <span className='font-medium text-orange-600'>{order.totalPrice} сом</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className='text-center p-4'>
                <p className='text-sm text-muted-foreground'>
                  Активных заказов: <span className='font-medium'>{orders.active.length}</span>
                </p>
              </div>
            </>
          ) : (
            <div className='text-center p-8'>
              <p className='text-muted-foreground'>Нет активных заказов</p>
            </div>
          )}
        </div>
      )}

      {/* Контент для завершенных заказов */}
      {activeOrderType === 'completed' && (
        <div className='space-y-3'>
          {orders.completed.length > 0 ? (
            <>
              {orders.completed.map((order) => (
                <div key={order.id} className='p-4 rounded-lg border bg-gray-50 border-gray-200'>
                  <div className='flex items-center justify-between mb-2'>
                    <h4 className='font-medium text-gray-800'>Заказ #{order.id.slice(-8)}</h4>
                    <span className='text-sm text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded'>
                      {orderStatusLabels[order.status]}
                    </span>
                  </div>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Дата:</span>
                      <span className='font-medium'>
                        {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    {order.completedAt && (
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Завершен:</span>
                        <span className='font-medium'>
                          {new Date(order.completedAt).toLocaleTimeString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Тип:</span>
                      <span className='font-medium'>{order.type}</span>
                    </div>
                    {order.totalPrice && (
                      <div className='flex justify-between'>
                        <span className='text-muted-foreground'>Стоимость:</span>
                        <span className='font-medium text-gray-600'>{order.totalPrice} сом</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div className='text-center p-4'>
                <p className='text-sm text-muted-foreground'>
                  Завершенных заказов: <span className='font-medium'>{orders.completed.length}</span>
                </p>
              </div>
            </>
          ) : (
            <div className='text-center p-8'>
              <p className='text-muted-foreground'>Нет завершенных заказов</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
