import { useQuery } from '@tanstack/react-query';
import { OrdersApi } from '../api/orders';
import type { GetOrderDTO } from '../interface';

/**
 * Опции для хука загрузки запланированного заказа
 */
export interface UseScheduledOrderByIdOptions {
  /** Включить автоматическую загрузку */
  enabled?: boolean;
}

/**
 * Результат хука загрузки запланированного заказа
 */
export interface UseScheduledOrderByIdResult {
  /** Данные заказа */
  order: GetOrderDTO | null;
  
  /** Состояние загрузки */
  isLoading: boolean;
  
  /** Ошибка */
  error: Error | null;
  
  /** Функция для повторной загрузки */
  refetch: () => void;
}

/**
 * Хук для загрузки запланированного заказа по ID
 */
export function useScheduledOrderById(
  id: string | null,
  options: UseScheduledOrderByIdOptions = {}
): UseScheduledOrderByIdResult {
  const { enabled = true } = options;

  const query = useQuery({
    queryKey: ['scheduled-order', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Order ID is required');
      }
      
      return OrdersApi.getScheduledOrder(id);
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 минут
    retry: 2,
  });

  return {
    order: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
