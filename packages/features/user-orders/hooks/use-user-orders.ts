'use client';

import { useState, useEffect, useCallback } from 'react';
import { ordersApi } from '@shared/api/orders';
import { logger } from '@shared/lib';
import type { GetOrderDTO } from '@entities/orders/interface';

interface UseUserOrdersReturn {
  orders: GetOrderDTO[];
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserOrders(userId: string): UseUserOrdersReturn {
  const [orders, setOrders] = useState<GetOrderDTO[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (userId) {
        const result = await ordersApi.getUserOrders(userId, { Size: 10 });
        setOrders(result.data || []);
        setTotalCount(result.totalCount || 0);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки заказов пользователя';

      setError(errorMessage);
      logger.error('Failed to fetch user orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const refetch = useCallback(() => {
    return fetchUserOrders();
  }, [fetchUserOrders]);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  return {
    orders,
    totalCount,
    isLoading,
    error,
    refetch,
  };
}
