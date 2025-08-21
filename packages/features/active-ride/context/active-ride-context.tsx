'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { driverQueueApi } from '@shared/api/driver-queue';
import { orderService, driverActiveOrdersApi, type GetOrderDTO } from '@shared/api/orders';
import { ridesApi } from '@shared/api/rides/rides-api';
import { logger } from '@shared/lib/logger';
import type { ScheduledRidesResponse } from '@entities/rides/interface';

interface ActiveRideContextType {
  activeRides: ScheduledRidesResponse | null;
  scheduledRides: ScheduledRidesResponse | null;
  currentOrder: GetOrderDTO | null;
  hasActiveRide: boolean;
  hasActiveOrder: boolean;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const ActiveRideContext = createContext<ActiveRideContextType | undefined>(undefined);

export function ActiveRideProvider({ children }: { children: React.ReactNode }) {
  const [activeRides, setActiveRides] = useState<ScheduledRidesResponse | null>(null);
  const [scheduledRides, setScheduledRides] = useState<ScheduledRidesResponse | null>(null);
  const [currentOrder, setCurrentOrder] = useState<GetOrderDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Проверяем наличие активного заказа
  const hasActiveOrder = currentOrder !== null;

  // Проверяем наличие активной поездки (InProgress, Arrived)
  const hasActiveRide = activeRides?.data?.some(ride => 
    ride.status === 'Arrived' || 
    ride.status === 'InProgress'
  ) || false;

  // Загрузка активных заказов, активных и запланированных поездок
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Получаем назначенные поездки
      const allRidesResponse = await ridesApi.getMyAssignedRides();

      // Пытаемся получить активный заказ двумя способами:
      // 1. Через статус очереди (если водитель в очереди и получил orderId)
      // 2. Через API активных заказов (если водитель не в очереди, но имеет активный заказ)
      let orderData: GetOrderDTO | null = null;
      
      try {
        // Сначала пробуем получить orderId из очереди
        logger.info('🔍 ActiveRideProvider: Запрашиваем статус очереди...');
        const queueStatus = await driverQueueApi.getQueueStatus();
        
        logger.info('🔍 ActiveRideProvider: Ответ DriverQueue/self:', {
          queueStatus: queueStatus,
          hasOrderId: !!queueStatus?.orderId,
          orderId: queueStatus?.orderId || null
        });

        if (queueStatus?.orderId) {
          logger.info('🔍 ActiveRideProvider: Получаем заказ по orderId:', queueStatus.orderId);
          orderData = await orderService.getOrderById(queueStatus.orderId);
          logger.info('✅ ActiveRideProvider: Получен активный заказ из очереди', { 
            orderId: queueStatus.orderId,
            orderData: orderData 
          });
        } else {
          logger.info('ℹ️ ActiveRideProvider: В статусе очереди нет orderId');
        }
      } catch (queueError) {
        // Если водитель не в очереди (404), пробуем получить активные заказы
        logger.info('ℹ️ ActiveRideProvider: Водитель не в очереди, проверяем активные заказы');
        try {
          const activeOrdersResponse = await driverActiveOrdersApi.getMyActiveOrders();

          logger.info('🔍 ActiveRideProvider: Ответ API активных заказов:', {
            response: activeOrdersResponse,
            hasData: !!activeOrdersResponse.data,
            dataLength: activeOrdersResponse.data?.length || 0,
            firstOrder: activeOrdersResponse.data?.[0] || null
          });
          
          if (activeOrdersResponse.data && activeOrdersResponse.data.length > 0) {
            orderData = activeOrdersResponse.data[0]; // Берем первый активный заказ
            logger.info('✅ ActiveRideProvider: Получен активный заказ через API', { 
              orderId: orderData?.id,
              orderStatus: orderData?.status,
              orderType: orderData?.type 
            });
          } else {
            logger.info('ℹ️ ActiveRideProvider: Активных заказов не найдено');
          }
        } catch (orderError) {
          logger.error('❌ ActiveRideProvider: Ошибка получения активных заказов:', orderError);
        }
      }

      // Разделяем поездки на активные (InProgress, Arrived) и запланированные (Accepted, Requested, Searching)
      const activeRidesData = {
        ...allRidesResponse,
        data: allRidesResponse.data.filter(ride => 
          ride.status === 'Arrived' || ride.status === 'InProgress'
        )
      };
      
      const scheduledRidesData = {
        ...allRidesResponse,
        data: allRidesResponse.data.filter(ride => 
          ride.status === 'Accepted' || 
          ride.status === 'Requested' || 
          ride.status === 'Searching'
        )
      };

      // Устанавливаем состояние
      logger.info('🔧 ActiveRideProvider: Устанавливаем состояние', {
        orderData: orderData,
        orderDataId: orderData?.id || null,
        orderDataStatus: orderData?.status || null,
        willSetCurrentOrder: !!orderData
      });

      setCurrentOrder(orderData);
      setActiveRides(activeRidesData);
      setScheduledRides(scheduledRidesData);

      logger.info('✅ ActiveRideProvider: Данные успешно загружены', {
        hasActiveOrder: !!orderData,
        activeOrderId: orderData?.id || null,
        activeRides: activeRidesData?.data?.length || 0,
        scheduledRides: scheduledRidesData?.data?.length || 0,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      
      setError(errorMessage);
      logger.error('❌ ActiveRideProvider: Ошибка загрузки данных:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);



  // Загружаем данные при монтировании
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Автоматическое обновление каждые 30 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const value: ActiveRideContextType = {
    activeRides,
    scheduledRides,
    currentOrder,
    hasActiveRide,
    hasActiveOrder,
    isLoading,
    error,
    refreshData: fetchData,
  };

  return (
    <ActiveRideContext.Provider value={value}>
      {children}
    </ActiveRideContext.Provider>
  );
}

export function useActiveRide(): ActiveRideContextType {
  const context = useContext(ActiveRideContext);
  
  if (context === undefined) {
    throw new Error('useActiveRide must be used within an ActiveRideProvider');
  }

  return context;
}
