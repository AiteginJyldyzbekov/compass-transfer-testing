import { useMutation } from '@tanstack/react-query';
import { OrdersApi, type CreateInstantOrderRequest, type CreateInstantOrderByPartnerRequest } from '../api/orders';
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

  /** Роль пользователя для выбора правильного API */
  userRole?: 'admin' | 'operator' | 'partner' | 'driver';
}

/**
 * Результат хука создания моментального заказа
 */
export interface UseInstantOrderSubmitResult {
  /** Функция создания заказа */
  createOrder: (data: CreateInstantOrderRequest | CreateInstantOrderByPartnerRequest) => void;

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
  const { onSuccess, onError, onSettled, userRole = 'operator' } = options;

  const mutation = useMutation({
    mutationFn: (data: CreateInstantOrderRequest | CreateInstantOrderByPartnerRequest) => {
      // eslint-disable-next-line no-console
      console.log('📦 useInstantOrderSubmit: Создаем моментальный заказ', data);

      // Для партнеров используем отдельный API
      if (userRole === 'partner') {
        return OrdersApi.createInstantOrderByPartner(data as CreateInstantOrderByPartnerRequest);
      }

      return OrdersApi.createInstantOrder(data as CreateInstantOrderRequest);
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
