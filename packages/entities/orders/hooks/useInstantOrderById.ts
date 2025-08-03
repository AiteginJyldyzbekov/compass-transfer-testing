import { useQuery } from '@tanstack/react-query';
import { OrdersApi } from '../api/orders';
import type { GetOrderDTO } from '../interface';

/**
 * Опции для хука загрузки мгновенного заказа
 */
export interface UseInstantOrderByIdOptions {
  /** Включить автоматическую загрузку */
  enabled?: boolean;
}

/**
 * Результат хука загрузки мгновенного заказа
 */
export interface UseInstantOrderByIdResult {
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
 * Хук для загрузки мгновенного заказа по ID
 */
export function useInstantOrderById(
  id: string | undefined,
  options: UseInstantOrderByIdOptions = {}
): UseInstantOrderByIdResult {
  const { enabled = true } = options;

  const query = useQuery({
    queryKey: ['instant-order', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Order ID is required');
      }
      
      // eslint-disable-next-line no-console
      console.log('📦 useInstantOrderById: Загружаем мгновенный заказ', id);
      
      return OrdersApi.getInstantOrderById(id);
    },
    enabled: enabled && !!id,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 минут
  });

  return {
    order: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
