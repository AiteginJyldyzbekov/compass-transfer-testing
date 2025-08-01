import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import { OrdersApi, type CreateScheduledOrderRequest } from '../api/orders';
import type { GetOrderDTO } from '../interface';

/**
 * Интерфейс для обновления запланированного заказа
 * Включает поле status для редактирования
 */
export interface UpdateScheduledOrderRequest extends CreateScheduledOrderRequest {
  /** Статус заказа */
  status: 'Pending' | 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled' | 'Expired';
}

/**
 * Опции для хука получения запланированного заказа
 */
export interface UseGetScheduledOrderOptions {
  /** Колбэк при успешной загрузке */
  onSuccess?: (order: GetOrderDTO) => void;

  /** Колбэк при ошибке */
  onError?: (error: Error) => void;

  /** Включить автоматическую загрузку */
  enabled?: boolean;
}

/**
 * Результат хука получения запланированного заказа
 */
export interface UseGetScheduledOrderResult {
  /** Данные заказа */
  order: GetOrderDTO | null;
  
  /** Состояние загрузки */
  isLoading: boolean;
  
  /** Ошибка */
  error: Error | null;
  
  /** Функция перезагрузки */
  refetch: () => void;
}

/**
 * Хук для получения запланированного заказа по ID
 * GET /Order/scheduled/{uuid}
 */
export function useGetScheduledOrder(
  orderId: string | null,
  options: UseGetScheduledOrderOptions = {}
): UseGetScheduledOrderResult {
  const { onSuccess, onError, enabled = true } = options;

  const query = useQuery({
    queryKey: ['scheduled-order', orderId],
    queryFn: () => {
      if (!orderId) {
        throw new Error('Order ID is required');
      }

      return OrdersApi.getScheduledOrder(orderId);
    },
    enabled: enabled && !!orderId,
  });

  // Обрабатываем успех и ошибки через useEffect
  React.useEffect(() => {
    if (query.data && !query.isLoading) {
      onSuccess?.(query.data);
    }
  }, [query.data, query.isLoading, onSuccess]);

  React.useEffect(() => {
    if (query.error) {
      onError?.(query.error);
    }
  }, [query.error, onError]);

  return {
    order: query.data || null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch
  };
}

/**
 * Опции для хука обновления запланированного заказа
 */
export interface UseUpdateScheduledOrderOptions {
  /** Колбэк при успешном обновлении */
  onSuccess?: (order: GetOrderDTO) => void;

  /** Колбэк при ошибке */
  onError?: (error: Error) => void;

  /** Колбэк при завершении (успех или ошибка) */
  onSettled?: () => void;
}

/**
 * Результат хука обновления запланированного заказа
 */
export interface UseUpdateScheduledOrderResult {
  /** Функция обновления заказа */
  updateOrder: (orderId: string, data: UpdateScheduledOrderRequest) => Promise<GetOrderDTO>;
  
  /** Состояние загрузки */
  isLoading: boolean;
  
  /** Ошибка */
  error: Error | null;
  
  /** Результат */
  data: GetOrderDTO | null;
  
  /** Сброс состояния */
  reset: () => void;
}

/**
 * Хук для обновления запланированного заказа
 * PUT /Order/scheduled/{uuid}
 */
export function useUpdateScheduledOrder(
  options: UseUpdateScheduledOrderOptions = {}
): UseUpdateScheduledOrderResult {
  const { onSuccess, onError, onSettled } = options;

  const mutation = useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: UpdateScheduledOrderRequest }) => 
      OrdersApi.updateScheduledOrder(orderId, data),
    
    onSuccess: (data: GetOrderDTO) => {
      onSuccess?.(data);
    },

    onError: (error: Error) => {
      onError?.(error);
    },
    
    onSettled: () => {
      onSettled?.();
    }
  });

  const updateOrder = async (orderId: string, data: UpdateScheduledOrderRequest) => {
    return mutation.mutateAsync({ orderId, data });
  };

  return {
    updateOrder,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data || null,
    reset: mutation.reset
  };
}
