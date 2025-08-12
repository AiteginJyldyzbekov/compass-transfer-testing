'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { driverQueueApi, type QueueStatusResponse } from '@shared/api/driver-queue';
import { logger } from '@shared/lib/logger';

interface DriverQueueContextType {
  // Состояние
  queueData: QueueStatusResponse | null;
  isInQueue: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Действия
  checkQueueStatus: () => Promise<void>;
  joinQueue: () => Promise<void>;
  leaveQueue: () => Promise<void>;
  refetch: () => Promise<void>;
}

const DriverQueueContext = createContext<DriverQueueContextType | undefined>(undefined);

interface DriverQueueProviderProps {
  children: React.ReactNode;
  autoRefreshInterval?: number; // Интервал автообновления в миллисекундах
}

export function DriverQueueProvider({ 
  children, 
  autoRefreshInterval = 30000 // По умолчанию 30 секунд
}: DriverQueueProviderProps) {
  const [queueData, setQueueData] = useState<QueueStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isInQueue = queueData !== null;

  const checkQueueStatus = useCallback(async () => {
    try {
      setError(null);
      const status = await driverQueueApi.getQueueStatus();

      setQueueData(status);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при получении статуса очереди';

      logger.error('Ошибка при проверке статуса очереди:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const joinQueue = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await driverQueueApi.joinQueue();
      
      // Обновляем состояние с данными из ответа
      setQueueData({
        driverId: result.driverId,
        joinedAt: result.joinedAt,
        position: result.position || 1
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при входе в очередь';
      
      logger.error('Ошибка при входе в очередь:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const leaveQueue = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await driverQueueApi.leaveQueue();
      setQueueData(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при выходе из очереди';
      
      logger.error('Ошибка при выходе из очереди:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    await checkQueueStatus();
  }, [checkQueueStatus]);

  // Первоначальная загрузка при монтировании
  useEffect(() => {
    checkQueueStatus();
  }, [checkQueueStatus]);

  // Автообновление статуса очереди
  useEffect(() => {
    if (!autoRefreshInterval) return;

    const interval = setInterval(() => {
      // Обновляем только если не в процессе загрузки
      if (!isLoading) {
        checkQueueStatus();
      }
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, [checkQueueStatus, isLoading, autoRefreshInterval]);

  const value: DriverQueueContextType = {
    queueData,
    isInQueue,
    isLoading,
    error,
    checkQueueStatus,
    joinQueue,
    leaveQueue,
    refetch,
  };

  return (
    <DriverQueueContext.Provider value={value}>
      {children}
    </DriverQueueContext.Provider>
  );
}

export function useDriverQueue(): DriverQueueContextType {
  const context = useContext(DriverQueueContext);
  
  if (context === undefined) {
    throw new Error('useDriverQueue must be used within a DriverQueueProvider');
  }
  
  return context;
}
