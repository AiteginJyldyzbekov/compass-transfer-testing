'use client';

import { useState, useEffect, useCallback } from 'react';
import { ordersApi, type GetMyOrdersParams } from '@shared/api/orders';
import { logger } from '@shared/lib';
import type { GetOrderDTO, OrderStatsDTO } from '@entities/orders/interface';

interface UseMyOrdersReturn {
  orders: GetOrderDTO[];
  totalCount: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateFilters: (params: GetMyOrdersParams) => void;
  currentFilters: GetMyOrdersParams;
}

export function useMyOrders(initialParams?: GetMyOrdersParams): UseMyOrdersReturn {
  const [data, setData] = useState({
    data: [] as GetOrderDTO[],
    totalCount: 0,
    pageSize: 10,
    hasPrevious: false,
    hasNext: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<GetMyOrdersParams>(
    initialParams || { Size: 10 }
  );

  const fetchOrders = useCallback(async (params: GetMyOrdersParams = currentFilters) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await ordersApi.getMyOrders(params);
      
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки заказов';
      
      setError(errorMessage);
      logger.error('Failed to fetch orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentFilters]);

  const updateFilters = useCallback((params: GetMyOrdersParams) => {
    setCurrentFilters(params);
    fetchOrders(params);
  }, [fetchOrders]);

  const refetch = useCallback(() => {
    return fetchOrders(currentFilters);
  }, [fetchOrders, currentFilters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders: data.data,
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    hasPrevious: data.hasPrevious,
    hasNext: data.hasNext,
    isLoading,
    error,
    refetch,
    updateFilters,
    currentFilters,
  };
}

interface UseOrderStatsReturn {
  stats: OrderStatsDTO | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOrderStats(): UseOrderStatsReturn {
  const [stats, setStats] = useState<OrderStatsDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await ordersApi.getMyOrdersStats();
      
      setStats(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки статистики';
      
      setError(errorMessage);
      logger.error('Failed to fetch order stats:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
