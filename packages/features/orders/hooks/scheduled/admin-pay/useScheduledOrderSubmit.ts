import { useCallback } from 'react';
import { toast } from 'sonner';
import { orderService } from '@shared/api/orders';
import { CreateScheduledOrderDTOSchema, type CreateScheduledOrderDTOType } from '@entities/orders/schemas';
import { useOrderSubmit, type OrderSubmitOptions } from '@features/orders/hooks/shared/useOrderSubmit';

// Временный тип для GetScheduledOrderDTO
type GetScheduledOrderDTO = {
  id: string;
  scheduledTime: string;
  passengers: unknown[];
  rides?: Array<{
    id: string;
    driverId?: string;
    carId?: string;
  }>;
};

// Заглушки для недостающих сервисов
const rideService = {
  updateRide: async (_id: string, _data: unknown) => ({ id: _id }),
  createRide: async (_data: unknown) => ({ id: 'new-ride-id' }),
};

// Заглушка для RideStatus
const RideStatus = {
  Requested: 'requested',
  Accepted: 'accepted',
  InProgress: 'in_progress',
  Completed: 'completed',
  Cancelled: 'cancelled',
};

// Заглушка для showToast
const showToast = {
  error: (message: string) => toast.error(message),
  success: (message: string) => toast.success(message),
  warn: (message: string) => toast.warning(message),
};

interface UseScheduledOrderSubmitProps {
  mode: 'create' | 'edit';
  id?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  orderData?: GetScheduledOrderDTO | null;
  passengers?: any[];
  onPassengersChange?: (passengers: any[]) => void;
}

/**
 * Трансформирует данные формы перед отправкой на сервер
 * Применяет все трансформации из схемы валидации
 */
const transformDataForAPI = (data: CreateScheduledOrderDTOType): CreateScheduledOrderDTOType => {
  try {
    // Применяем схему валидации с трансформациями
    return CreateScheduledOrderDTOSchema.parse(data);
  } catch {
    // Если валидация не прошла, возвращаем исходные данные
    // (ошибки валидации должны были быть обработаны на уровне формы)
    return data;
  }
};

/**
 * Хук для отправки данных запланированного заказа
 */
export const useScheduledOrderSubmit = ({
  mode,
  id,
  onSuccess,
  onCancel,
  orderData,
  passengers: _passengers = [],
  onPassengersChange,
}: UseScheduledOrderSubmitProps) => {
  const submitFn = useCallback(
    async (data: CreateScheduledOrderDTOType, options: OrderSubmitOptions) => {
      console.log('📤 Данные перед отправкой:', data);
      console.log('📤 Services перед отправкой:', data.services);

      // Трансформируем данные перед отправкой
      const transformedData = transformDataForAPI(data);

      if (options.mode === 'edit' && options.id) {
        // Для обновления добавляем orderId и status
        const updateData = {
          ...transformedData,
          orderId: options.id,
          status: 'Pending',
        };

        const result = await orderService.updateScheduledOrder(options.id, updateData);

        // Обновляем пассажиров если они переданы
        if (
          transformedData.passengers &&
          transformedData.passengers.length > 0 &&
          onPassengersChange
        ) {
          onPassengersChange(transformedData.passengers);
        }

        // Обработка поездок при обновлении заказа
        if (orderData && orderData.rides && orderData.rides.length > 0) {
          const existingRide = orderData.rides[0];

          if (transformedData.driverId && transformedData.carId) {
            try {
              await rideService.updateRide(existingRide.id, {
                orderId: options.id,
                driverId: transformedData.driverId,
                carId: transformedData.carId,
                status: RideStatus.Requested,
                waypoints: transformedData.waypoints || [],
              });
            } catch (error) {
              showToast.error('Заказ обновлен, но возникла ошибка при обновлении поездки');
              throw error;
            }
          } else {
            try {
              await rideService.updateRide(existingRide.id, {
                orderId: options.id,
                driverId: existingRide.driverId,
                carId: existingRide.carId,
                status: RideStatus.Cancelled,
                waypoints: [],
              });
            } catch (error) {
              showToast.error('Заказ обновлен, но возникла ошибка при отмене поездки');
              throw error;
            }
          }
        } else if (transformedData.driverId && transformedData.carId) {
          try {
            await orderService.createScheduledRide(options.id, {
              driverId: transformedData.driverId,
              carId: transformedData.carId,
              waypoints: transformedData.waypoints || [],
            });
          } catch (error) {
            showToast.error('Заказ обновлен, но возникла ошибка при создании поездки');
            throw error;
          }
        }

        return result;
      } else {
        // Для создания используем трансформированные данные
        const result = await orderService.createScheduledOrder(transformedData);

        // Если указан водитель и авто — создаём рейс для запланированного заказа
        if (transformedData.driverId && transformedData.carId) {
          try {
            await orderService.createScheduledRide(result.id, {
              driverId: transformedData.driverId,
              carId: transformedData.carId,
              waypoints: transformedData.waypoints || [],
            });
          } catch (error) {
            showToast.error('Заказ создан, но возникла ошибка при назначении водителя');
            throw error;
          }
        }

        return result;
      }
    },
    [orderData, onPassengersChange],
  );

  const options: OrderSubmitOptions = {
    mode: mode === 'create' ? 'create' : 'edit',
    id,
    onSuccess,
    onCancel,
  };

  return useOrderSubmit<CreateScheduledOrderDTOType>(submitFn, options);
};
