import { z } from 'zod';
import { OrderServiceDTOSchema } from './OrderServiceDTO.schema';
import { OrderStatusSchema } from './OrderStatus.schema';

/**
 * Схема валидации для UpdateInstantOrderDTO
 * API: PUT /Order/instant/{uuid}
 */
export const UpdateInstantOrderDTOSchema = z.object({
  tariffId: z.string({ required_error: 'Выберите тариф' }).uuid({ message: 'Выберите корректный тариф' }),
  routeId: z.string().uuid({ message: 'Некорректный маршрут' }).nullable().optional(),
  startLocationId: z.string().uuid({ message: 'Некорректная начальная точка' }).nullable().optional(),
  endLocationId: z.string().uuid({ message: 'Некорректная конечная точка' }).nullable().optional(),
  additionalStops: z.array(z.string().uuid({ message: 'Некорректная промежуточная точка' })).default([]),
  services: z.array(OrderServiceDTOSchema).default([]),
  initialPrice: z.number({ required_error: 'Укажите стоимость' }).min(0, { message: 'Стоимость не может быть отрицательной' }),
  status: OrderStatusSchema
}).refine((data) => {
  // Проверяем, что указан либо routeId, либо startLocationId и endLocationId
  if (data.routeId) {
    return true; // Если есть шаблон маршрута, то локации не обязательны
  }

  return data.startLocationId && data.endLocationId; // Иначе обе локации обязательны
}, {
  message: 'Необходимо указать либо шаблон маршрута, либо начальную и конечную точки',
  path: ['routeId'],
});
/**
 * Тип, выведенный из схемы UpdateInstantOrderDTOSchema
 */
export type UpdateInstantOrderDTOType = z.infer<typeof UpdateInstantOrderDTOSchema>;