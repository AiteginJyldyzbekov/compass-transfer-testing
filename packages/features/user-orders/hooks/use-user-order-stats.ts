'use client';

import { useState, useEffect, useCallback } from 'react';
import { ordersApi } from '@shared/api/orders/orders-api';
import { logger } from '@shared/lib';
import type { OrderStatsDTO } from '@entities/orders/interface';

interface UseUserOrderStatsReturn {
  stats: OrderStatsDTO | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserOrderStats(userId: string): UseUserOrderStatsReturn {
  const [stats, setStats] = useState<OrderStatsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (userId) {
        const result = await ordersApi.getUserOrdersStats(userId);
        setStats(result);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки статистики заказов';
      
      setError(errorMessage);
      logger.error('Failed to fetch user order stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const refetch = useCallback(() => {
    return fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
}
