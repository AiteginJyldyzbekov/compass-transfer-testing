'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrderStack } from '../hooks/useOrderStack';
import { driverOrderApi } from '@shared/api/orders';
import { toast } from '@shared/lib/conditional-toast';
import { ClockIcon, ProfileIcon } from '@shared/icons';

export function OrderStackList() {
  const { orderStack, removeFromStack } = useOrderStack();
  const [acceptingOrderId, setAcceptingOrderId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const router = useRouter();

  // Обновляем текущее время каждую секунду для таймера
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      setAcceptingOrderId(orderId);
      
      // Принимаем заказ через API
      await driverOrderApi.acceptInstantOrder(orderId);
      
      // Удаляем из стакана
      removeFromStack(orderId);
      
      toast.success('✅ Заказ принят!');
      
      // Переходим на главную страницу для просмотра деталей заказа
      router.push('/');
    } catch (error) {
      console.error('Ошибка принятия заказа:', error);
      toast.error('Ошибка принятия заказа');
    } finally {
      setAcceptingOrderId(null);
    }
  };


  const formatTimeRemaining = (expiresAt: number) => {
    const remaining = expiresAt - currentTime;
    
    if (remaining <= 0) return 'Истек';
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (orderStack.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg mb-2">📦</div>
        <p className="text-gray-600 text-sm">
          Стакан заказов пуст
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Новые заказы появятся здесь автоматически
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orderStack.map((item) => {
        const { order } = item;
        const isAccepting = acceptingOrderId === order.id;
        const timeRemaining = formatTimeRemaining(item.expiresAt);
        const isExpired = timeRemaining === 'Истек';

        return (
          <div
            key={order.id}
            className={`bg-white rounded-lg border p-4 ${
              isExpired ? 'opacity-50 border-gray-200' : 'border-blue-200 shadow-sm'
            }`}
          >
            {/* Заголовок с временем */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-2">
                <ClockIcon size={16} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Заказ #{order.id.slice(-6)}
                </span>
              </div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                isExpired 
                  ? 'bg-gray-100 text-gray-500' 
                  : 'bg-orange-100 text-orange-600'
              }`}>
                {timeRemaining}
              </div>
            </div>

            {/* Маршрут */}
            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 truncate">
                    {order.pickupLocation?.address || 'Адрес не указан'}
                  </p>
                </div>
              </div>
              
              {order.dropoffLocation && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 truncate">
                      {order.dropoffLocation.address}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Информация о пассажире */}
            {order.passenger && (
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                <ProfileIcon size={16} />
                <span>{order.passenger.fullName}</span>
                {order.passenger.phoneNumber && (
                  <>
                    <span className="text-xs">📞</span>
                    <span>{order.passenger.phoneNumber}</span>
                  </>
                )}
              </div>
            )}

            {/* Стоимость */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600">Стоимость:</span>
              <span className="text-lg font-bold text-blue-600">
                {order.totalPrice} KGS
              </span>
            </div>

            {/* Кнопка принятия заказа */}
            {!isExpired && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleAcceptOrder(order.id)}
                  disabled={isAccepting}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isAccepting ? 'Принимаем...' : 'Принять заказ'}
                </button>
              </div>
            )}

            {isExpired && (
              <div className="text-center py-2">
                <span className="text-sm text-gray-500">
                  Время истекло
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
