import { useMutation } from '@tanstack/react-query';
import { OrdersApi, type CreateScheduledOrderRequest } from '../api/orders';
import type { GetOrderDTO } from '../interface';

/**
 * Опции для хука отправки запланированного заказа
 */
export interface UseScheduledOrderSubmitOptions {
  /** Колбэк при успешной отправке */
  onSuccess?: (order: GetOrderDTO) => void;

  /** Колбэк при ошибке */
  onError?: (error: Error) => void;

  /** Колбэк при завершении (успех или ошибка) */
  onSettled?: () => void;
}

/**
 * Результат хука отправки запланированного заказа
 */
export interface UseScheduledOrderSubmitResult {
  /** Функция отправки заказа */
  submitOrder: (data: CreateScheduledOrderRequest) => Promise<GetOrderDTO>;

  /** Состояние загрузки */
  isLoading: boolean;

  /** Ошибка отправки */
  error: Error | null;

  /** Результат отправки */
  data: GetOrderDTO | null;

  /** Сброс состояния */
  reset: () => void;
}

/**
 * Хук для отправки запланированного заказа
 * 
 * @param options - Опции хука
 * @returns Результат хука
 * 
 * @example
 * ```tsx
 * const { submitOrder, isLoading, error } = useScheduledOrderSubmit({
 *   onSuccess: (order) => {
 *     console.log('Order created:', order);
 *     router.push(`/orders/${order.id}`);
 *   },
 *   onError: (error) => {
 *     console.error('Failed to create order:', error);
 *   }
 * });
 * 
 * const handleSubmit = async () => {
 *   try {
 *     const order = await submitOrder({
 *       tariffId: 'tariff-id',
 *       startLocationId: 'start-location-id',
 *       endLocationId: 'end-location-id',
 *       additionalStops: [],
 *       services: [],
 *       initialPrice: 100,
 *       scheduledTime: new Date().toISOString(),
 *       passengers: [{
 *         firstName: 'John',
 *         lastName: 'Doe',
 *         isMainPassenger: true
 *       }]
 *     });
 *   } catch (error) {
 *     // Ошибка уже обработана в onError
 *   }
 * };
 * ```
 */
export function useScheduledOrderSubmit(
  options: UseScheduledOrderSubmitOptions = {}
): UseScheduledOrderSubmitResult {
  const { onSuccess, onError, onSettled } = options;

  const mutation = useMutation({
    mutationFn: (data: CreateScheduledOrderRequest) => 
      OrdersApi.createScheduledOrder(data),
    
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

  return {
    submitOrder: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data || null,
    reset: mutation.reset
  };
}

/**
 * Хук для назначения водителя на запланированный заказ
 */
export interface UseScheduledRideSubmitOptions {
  /** Колбэк при успешном назначении */
  onSuccess?: (ride: any) => void;
  
  /** Колбэк при ошибке */
  onError?: (error: Error) => void;
}

export interface UseScheduledRideSubmitResult {
  /** Функция назначения водителя */
  assignDriver: (orderId: string, data: any) => Promise<any>;
  
  /** Состояние загрузки */
  isLoading: boolean;
  
  /** Ошибка */
  error: Error | null;
  
  /** Результат */
  data: any | null;
  
  /** Сброс состояния */
  reset: () => void;
}

/**
 * Хук для назначения водителя на запланированный заказ
 * POST /Order/scheduled/{uuid}/ride
 */
export function useScheduledRideSubmit(
  options: UseScheduledRideSubmitOptions = {}
): UseScheduledRideSubmitResult {
  const { onSuccess, onError } = options;

  const mutation = useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: any }) => 
      OrdersApi.createScheduledRide(orderId, data),
    
    onSuccess: (data: any) => {
      onSuccess?.(data);
    },

    onError: (error: Error) => {
      onError?.(error);
    }
  });

  const assignDriver = async (orderId: string, data: any) => {
    return mutation.mutateAsync({ orderId, data });
  };

  return {
    assignDriver,
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data || null,
    reset: mutation.reset
  };
}
