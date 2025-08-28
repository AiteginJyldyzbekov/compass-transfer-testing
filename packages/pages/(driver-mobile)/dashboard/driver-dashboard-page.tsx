'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { orderService, type GetOrderDTO } from '@shared/api/orders';
import { ActiveOrderCard } from '@features/active-ride';  
import { useDriverQueue } from '@features/driver-queue';
import { DriverStatusCard } from './components/driver-status-card';
import DriverStatusBlock from './components/driver-status-block';

export default function DriverDashboardPage() {
  const [currentOrder, setCurrentOrder] = useState<GetOrderDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);
  
  // Используем данные из useDriverQueue вместо дублирования запросов
  const { queueData, isInQueue, isLoading: queueLoading, error: queueError, joinQueue, leaveQueue } = useDriverQueue();


  // Функция для получения активного заказа на основе данных из очереди
  const fetchActiveOrder = useCallback(async () => {  
    try {
      setIsLoading(true);
      setError(null);
      
      let orderData: GetOrderDTO | null = null;

      if (queueData?.orderId) {
        orderData = await orderService.getOrderById(queueData.orderId);
      } else if (queueData && 'id' in queueData) {
        // Если в 404 ответе есть данные заказа напрямую, используем их
        orderData = queueData as unknown as GetOrderDTO; 
      }

      setCurrentOrder(orderData);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [queueData]);

  useEffect(() => {
    fetchActiveOrder();
  }, [fetchActiveOrder]);

  // Слушатель события принятия заказа
  useEffect(() => {
    const handleOrderAccepted = () => {
      console.log('🚨 ПОЛУЧЕНО СОБЫТИЕ ПРИНЯТИЯ ЗАКАЗА - ОБНОВЛЯЮ ДАННЫЕ');
      fetchActiveOrder();
    };

    window.addEventListener('orderAccepted', handleOrderAccepted);

    return () => {
      window.removeEventListener('orderAccepted', handleOrderAccepted);
    };
  }, [fetchActiveOrder]);

  const hasActiveOrder = !!currentOrder;

  if (isLoading) {
    return (
      <div className='h-full flex flex-col p-4 space-y-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Главная</h1>
        </div>
        <div className='flex-1 flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto' />
            <p className='mt-2 text-gray-600'>Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='h-full flex flex-col p-4 space-y-4'>
      {/* Контент: либо активный заказ, либо статус водителя */}
      <div className='flex-1 min-h-0 pb-[80px]'>
        {currentOrder ? (
          <ActiveOrderCard
            order={currentOrder}
            onStatusUpdate={fetchActiveOrder}
          />
        ) : (
          <DriverStatusCard 
            queueData={queueData}
            isInQueue={isInQueue}
            isLoading={queueLoading}
            error={queueError}
            joinQueue={joinQueue}
            leaveQueue={leaveQueue}
          />
        )}
        <DriverStatusBlock />
      </div>
    </div>
  );
}
