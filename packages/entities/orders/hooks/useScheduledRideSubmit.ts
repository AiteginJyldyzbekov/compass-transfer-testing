import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { GetRideDTO } from '@entities/rides/interface/GetRideDTO';
import { OrdersApi } from '../api/orders';
import type { CreateScheduledRideDTO } from '../interface/CreateScheduledRideDTO';

/**
 * Опции для хука назначения водителя на запланированный заказ
 */
export interface UseScheduledRideSubmitOptions {
  /** Колбэк при успешном назначении водителя */
  onSuccess?: (ride: GetRideDTO) => void;

  /** Колбэк при ошибке */
  onError?: (error: Error) => void;

  /** Колбэк при завершении (успех или ошибка) */
  onSettled?: () => void;
}

/**
 * Результат хука назначения водителя на запланированный заказ
 */
export interface UseScheduledRideSubmitResult {
  /** Функция назначения водителя */
  assignDriver: (orderId: string, data: CreateScheduledRideDTO) => Promise<GetRideDTO>;

  /** Состояние загрузки */
  isLoading: boolean;

  /** Ошибка назначения */
  error: Error | null;

  /** Результат назначения */
  data: GetRideDTO | null;

  /** Сброс состояния */
  reset: () => void;
}

/**
 * Хук для назначения водителя на запланированный заказ
 */
export function useScheduledRideSubmit(
  options: UseScheduledRideSubmitOptions = {}
): UseScheduledRideSubmitResult {
  const { onSuccess, onError, onSettled } = options;

  const mutation = useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: CreateScheduledRideDTO }) => {
      return OrdersApi.createScheduledRide(orderId, data);
    },
    onSuccess: (data) => {
      toast.success('✅ Водитель успешно назначен на заказ');
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      toast.error(`❌ Ошибка назначения водителя: ${error.message}`);
      onError?.(error);
    },
    onSettled,
  });

  return {
    assignDriver: (orderId: string, data: CreateScheduledRideDTO) => 
      mutation.mutateAsync({ orderId, data }),
    isLoading: mutation.isPending,
    error: mutation.error,
    data: mutation.data || null,
    reset: mutation.reset,
  };
}
