'use client';

import { useState, useEffect } from 'react';
import { orderService } from '@shared/api/orders';
import type { GetOrderDTO } from '@entities/orders/interface';
import type { CreateScheduledOrderDTOType } from '@entities/orders/schemas';
import { useOrderDataLoader } from '@features/orders/hooks/shared/useOrderDataLoader';

// Временный тип для GetScheduledOrderDTO (пока не создан отдельный интерфейс)
type GetScheduledOrderDTO = GetOrderDTO;

/**
 * Трансформер для преобразования GetScheduledOrderDTO в CreateScheduledOrderDTOType
 * Вынесен за пределы компонента для стабильности ссылки
 */
const transformGetScheduledOrderToCreateScheduled = (
  data: GetScheduledOrderDTO,
): CreateScheduledOrderDTOType => {
  return {
    tariffId: data.tariffId || '',
    routeId: data.routeId,
    startLocationId: data.startLocationId,
    endLocationId: data.endLocationId,
    additionalStops: data.additionalStops,
    services: data.services.map(service => ({
      serviceId: service.serviceId,
      quantity: service.quantity,
      notes: service.notes || null, // ✅ Обрабатываем случай отсутствия notes
    })),
    initialPrice: data.initialPrice,
    scheduledTime: data.scheduledTime || '',
    passengers: data.passengers.map(passenger => ({
      firstName: passenger.firstName,
      lastName: passenger.lastName ?? null,
      isMainPassenger: passenger.isMainPassenger,
      customerId: passenger.customerId,
    })),
    // Поля для UI
    routeType: data.routeId ? ('template' as const) : ('manual' as const),
    // Дополнительные поля (опциональные)
    waypoints: [],
    // ✅ НОВЫЕ ПОЛЯ ИЗ API
    description: data.description || null,
    airFlight: data.airFlight || null,
    flyReis: data.flyReis || null,
  };
};

/**
 * Хук для загрузки данных запланированного заказа в режиме редактирования
 * ✅ ИСПРАВЛЕНИЕ: Теперь возвращает как трансформированные, так и исходные данные
 */
export const useScheduledOrderData = (id?: string, mode?: string) => {
  const [rawOrderData, setRawOrderData] = useState<GetScheduledOrderDTO | null>(null);

  const { orderData, isLoading, error } = useOrderDataLoader<
    GetScheduledOrderDTO,
    CreateScheduledOrderDTOType
  >(
    id,
    mode,
    // ✅ ИСПРАВЛЕНИЕ: Сохраняем исходные данные перед трансформацией
    async (orderId: string) => {
      const rawData = await orderService.getScheduledOrder(orderId);

      setRawOrderData(rawData); // Сохраняем исходные данные

      return rawData;
    },
    transformGetScheduledOrderToCreateScheduled,
  );

  // ✅ ИСПРАВЛЕНИЕ: Сбрасываем rawOrderData при смене режима
  useEffect(() => {
    if (mode !== 'edit' || !id) {
      setRawOrderData(null);
    }
  }, [mode, id]);

  return {
    orderData, // Трансформированные данные для формы
    rawOrderData, // ✅ ИСПРАВЛЕНИЕ: Теперь возвращаем исходные данные
    isLoading,
    error,
  };
};
