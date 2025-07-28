import { useCallback } from 'react';
import { orderService } from '@shared/api/orders';
import { OrderStatus } from '@entities/orders/enums/OrderStatus.enum';
import { CreateInstantOrderDTOSchema, type CreateInstantOrderDTOType } from '@entities/orders/schemas';
import { useOrderSubmit, type OrderSubmitOptions } from '@features/orders/hooks/shared/useOrderSubmit';

interface UseInstantOrderSubmitProps {
  mode: 'create' | 'edit';
  id?: string;
  onSuccess?: (orderId?: string) => void;
  onCancel?: () => void;
}

/**
 * Трансформирует данные формы перед отправкой на сервер
 * Применяет все трансформации из схемы валидации
 */
const transformDataForAPI = (data: CreateInstantOrderDTOType): CreateInstantOrderDTOType => {
  try {
    // Применяем схему валидации с трансформациями
    return CreateInstantOrderDTOSchema.parse(data);
  } catch {
    // Если валидация не прошла, возвращаем исходные данные
    // (ошибки валидации должны были быть обработаны на уровне формы)
    return data;
  }
};

/**
 * Хук для отправки данных мгновенного заказа
 */
export const useInstantOrderSubmit = ({
  mode,
  id,
  onSuccess,
  onCancel,
}: UseInstantOrderSubmitProps) => {
  const submitFn = useCallback(
    async (data: CreateInstantOrderDTOType, options: OrderSubmitOptions) => {
      // Трансформируем данные перед отправкой
      const transformedData = transformDataForAPI(data);

      if (options.mode === 'edit' && options.id) {
        // Для обновления добавляем обязательный статус
        const updateData = {
          ...transformedData,
          status: OrderStatus.Pending,
        };
        const result = await orderService.updateInstantOrder(options.id, updateData);

        return result;
      } else {
        // Для создания используем трансформированные данные
        const result = await orderService.createInstantOrder(transformedData);

        return result;
      }
    },
    [],
  );

  const options: OrderSubmitOptions = {
    mode,
    id,
    onSuccess,
    onCancel,
  };

  return useOrderSubmit<CreateInstantOrderDTOType>(submitFn, options);
};
