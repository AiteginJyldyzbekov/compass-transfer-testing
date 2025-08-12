'use client';

import { useState } from 'react';
import { driverOrderApi } from '@shared/api/orders';
import { Button } from '@shared/ui/forms/button';
import type { GetOrderDTO } from '@entities/orders/interface/GetOrderDTO';

interface IncomingOrderModalProps {
  order: GetOrderDTO;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (orderId: string) => void;
}

export function IncomingOrderModal({ order, isOpen, onClose, onAccept }: IncomingOrderModalProps) {
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = async () => {
    try {
      setIsAccepting(true);
      await driverOrderApi.acceptInstantOrder(order.id);
      onAccept(order.id);
    } catch (error) {
      console.error('Ошибка при принятии заказа:', error);
      // TODO: Показать уведомление об ошибке
    } finally {
      setIsAccepting(false);
    }
  };

  if (!isOpen) return null;

  // Получаем начальную и конечную точки
  const startLocation = order.waypoints?.[0]?.location;
  const endLocation = order.waypoints?.[order.waypoints.length - 1]?.location;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200'>
        {/* Заголовок */}
        <div className='bg-blue-600 text-white p-4 text-center'>
          <h2 className='text-lg font-bold'>Новый заказ</h2>
          <p className='text-blue-100 text-sm'>Заказ #{order.orderNumber}</p>
        </div>

        {/* Содержимое */}
        <div className='p-4 space-y-4'>
          {/* Маршрут */}
          <div className='space-y-3'>
            <div className='flex items-start space-x-3'>
              <div className='w-3 h-3 rounded-full bg-green-500 mt-1 flex-shrink-0' />
              <div className='flex-1'>
                <p className='text-sm text-gray-500'>Откуда</p>
                <p className='font-medium text-gray-900'>
                  {startLocation?.name || startLocation?.address || 'Не указано'}
                </p>
              </div>
            </div>

            <div className='flex items-start space-x-3'>
              <div className='w-3 h-3 rounded-full bg-red-500 mt-1 flex-shrink-0' />
              <div className='flex-1'>
                <p className='text-sm text-gray-500'>Куда</p>
                <p className='font-medium text-gray-900'>
                  {endLocation?.name || endLocation?.address || 'Не указано'}
                </p>
              </div>
            </div>
          </div>

          {/* Дополнительная информация */}
          <div className='grid grid-cols-2 gap-4 pt-2 border-t'>
            <div>
              <p className='text-sm text-gray-500'>Тип заказа</p>
              <p className='font-medium'>{order.type === 'Instant' ? 'Мгновенный' : 'Запланированный'}</p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Статус</p>
              <p className='font-medium'>
                {order.status === 'Searching' ? 'Поиск водителя' : order.status}
              </p>
            </div>
          </div>

          {/* Промежуточные точки */}
          {order.waypoints && order.waypoints.length > 2 && (
            <div className='pt-2 border-t'>
              <p className='text-sm text-gray-500 mb-2'>Промежуточные остановки:</p>
              <div className='space-y-1'>
                {order.waypoints.slice(1, -1).map((waypoint, index) => (
                  <div key={waypoint.locationId} className='flex items-center space-x-2'>
                    <div className='w-2 h-2 rounded-full bg-yellow-500' />
                    <p className='text-sm text-gray-700'>
                      {waypoint.location.name || waypoint.location.address}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Кнопки */}
        <div className='p-4 bg-gray-50 flex space-x-3'>
          <Button
            variant='outline'
            onClick={onClose}
            className='flex-1'
            disabled={isAccepting}
          >
            Отклонить
          </Button>
          <Button
            onClick={handleAccept}
            className='flex-1 bg-green-600 hover:bg-green-700'
            disabled={isAccepting}
          >
            {isAccepting ? 'Принимаю...' : 'Принять заказ'}
          </Button>
        </div>
      </div>
    </div>
  );
}
