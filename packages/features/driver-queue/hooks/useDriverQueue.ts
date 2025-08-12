'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { driverQueueApi, type JoinQueueResponse } from '@shared/api/driver-queue';
import { logger } from '@shared/lib/logger';

export interface UseDriverQueueResult {
  isInQueue: boolean;
  queueData: JoinQueueResponse | null;
  isLoading: boolean;
  actions: {
    joinQueue: () => Promise<void>;
    leaveQueue: () => Promise<void>;
    checkQueueStatus: () => Promise<void>;
  };
}

/**
 * Хук для работы с очередью водителей
 */
export function useDriverQueue(): UseDriverQueueResult {
  const [isInQueue, setIsInQueue] = useState(false);
  const [queueData, setQueueData] = useState<JoinQueueResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Встать в очередь
  const joinQueue = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await driverQueueApi.joinQueue();
      
      setIsInQueue(true);
      setQueueData(response);
      
      toast.success('✅ Вы встали в очередь');
      logger.info('🚗 useDriverQueue.joinQueue успешно:', response);
    } catch (error) {
      logger.error('❌ useDriverQueue.joinQueue ошибка:', error);
      toast.error('❌ Ошибка при вступлении в очередь');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Выйти из очереди
  const leaveQueue = useCallback(async () => {
    try {
      setIsLoading(true);
      await driverQueueApi.leaveQueue();
      
      setIsInQueue(false);
      setQueueData(null);
      
      toast.success('✅ Вы вышли из очереди');
      logger.info('🚗 useDriverQueue.leaveQueue успешно');
    } catch (error) {
      logger.error('❌ useDriverQueue.leaveQueue ошибка:', error);
      toast.error('❌ Ошибка при выходе из очереди');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Проверить статус очереди (можно добавить позже если будет API)
  const checkQueueStatus = useCallback(async () => {
    // TODO: Реализовать когда будет API для проверки статуса
    logger.info('🚗 useDriverQueue.checkQueueStatus - пока не реализовано');
  }, []);

  return {
    isInQueue,
    queueData,
    isLoading,
    actions: {
      joinQueue,
      leaveQueue,
      checkQueueStatus,
    },
  };
}
