import { useMutation } from '@tanstack/react-query';
import { OrdersApi, type CreateInstantOrderRequest } from '../api/orders';
import type { GetOrderDTO } from '../interface';

/**
 * Опции для хука создания моментального заказа
 */
export interface UseInstantOrderSubmitOptions {
  /** Колбэк при успешном создании */
  onSuccess?: (order: GetOrderDTO) => void;

  /** Колбэк при ошибке */
  onError?: (error: Error) => void;

  /** Колбэк при завершении (успех или ошибка) */
  onSettled?: () => void;
}

/**
 * Результат хука создания моментального заказа
 */
export interface UseInstantOrderSubmitResult {
  /** Функция создания заказа */
  createOrder: (data: CreateInstantOrderRequest) => void;
  
  /** Состояние загрузки */
  isLoading: boolean;
  
  /** Ошибка */
  error: Error | null;
  
  /** Данные созданного заказа */
  data: GetOrderDTO | null;
  
  /** Сброс состояния */
  reset: () => void;
}

/**
 * Хук для создания моментального заказа
 */
export function useInstantOrderSubmit(
  options: UseInstantOrderSubmitOptions = {}
): UseInstantOrderSubmitResult {
  const { onSuccess, onError, onSettled } = options;

  const mutation = useMutation({
    mutationFn: (data: CreateInstantOrderRequest) => {
      // eslint-disable-next-line no-console
      console.log('📦 useInstantOrderSubmit: Создаем моментальный заказ', data);
      
      return OrdersApi.createInstantOrder(data);
    },
    onSuccess: (data) => {
      // eslint-disable-next-line no-console
      console.log('✅ useInstantOrderSubmit: Заказ создан успешно', data);
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      // eslint-disable-next-line no-console
      console.error('❌ useInstantOrderSubmit: Ошибка создания заказа', error);
      onError?.(error);
    },
    onSettled,
  });

  return {
    createOrder: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data || null,
    reset: mutation.reset,
  };
}
