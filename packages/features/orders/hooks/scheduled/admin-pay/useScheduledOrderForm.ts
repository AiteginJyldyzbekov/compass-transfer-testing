'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CreateScheduledOrderDTOSchema, type CreateScheduledOrderDTOType } from '@entities/orders/schemas';

/**
 * Хук для управления формой создания/редактирования запланированного заказа
 */
export const useScheduledOrderForm = (initialData?: Partial<CreateScheduledOrderDTOType>) => {
  return useForm({
    resolver: zodResolver(CreateScheduledOrderDTOSchema),
    defaultValues: {
      tariffId: '',
      routeType: 'manual' as const,
      routeId: null,
      startLocationId: null,
      endLocationId: null,
      additionalStops: [],
      services: [],
      initialPrice: 0,
      scheduledTime: '',
      passengers: [],
      clientType: 'new' as const,
      customerId: undefined,
      firstName: '',
      lastName: undefined,
      driverId: undefined,
      carId: undefined,
      waypoints: [],
      // ✅ НОВЫЕ ПОЛЯ
      description: null,
      airFlight: null,
      flyReis: null,
      ...initialData,
    },
    mode: 'onChange',
  });
};
