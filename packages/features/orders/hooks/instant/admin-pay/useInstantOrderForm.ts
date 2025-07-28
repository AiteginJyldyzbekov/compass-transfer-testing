import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CreateInstantOrderDTOSchema, type CreateInstantOrderDTOType } from '@entities/orders/schemas';

/**
 * Хук для управления формой мгновенного заказа
 */
export const useInstantOrderForm = (defaultValues?: Partial<CreateInstantOrderDTOType>) => {
  return useForm({
    resolver: zodResolver(CreateInstantOrderDTOSchema),
    defaultValues: {
      tariffId: '',
      routeId: null,
      startLocationId: null,
      endLocationId: null,
      additionalStops: [],
      services: [],
      initialPrice: 0,
      passengers: [
        {
          customerId: null,
          firstName: 'МП',
          lastName: null,
          isMainPassenger: true,
        },
      ],
      ...defaultValues,
    },
    mode: 'onChange',
  });
};
