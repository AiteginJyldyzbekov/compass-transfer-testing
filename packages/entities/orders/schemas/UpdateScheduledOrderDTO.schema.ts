import { z } from 'zod';
import { createDateTimeTransform } from '@shared/lib/utils';
import { OrderServiceDTOSchema } from './OrderServiceDTO.schema';
import { OrderStatusSchema } from './OrderStatus.schema';

/**
 * Схема валидации пассажира для обновления заказа (с ID)
 */
export const UpdatePassengerDTOSchema = z.object({
  id: z.string().uuid({ message: 'Некорректный ID пассажира' }),
  customerId: z.string().uuid({ message: 'Выберите корректного клиента' }).nullable().optional(),
  firstName: z
    .string({ required_error: 'Имя пассажира обязательно' })
    .min(1, { message: 'Имя пассажира обязательно' })
    .max(63, { message: 'Имя не должно превышать 63 символа' }),
  lastName: z
    .string()
    .max(63, { message: 'Фамилия не должна превышать 63 символа' })
    .nullable()
    .optional(),
  isMainPassenger: z.boolean({ required_error: 'Укажите основного пассажира' }),
});

/**
 * Схема валидации для UpdateScheduledOrderDTO
 * API: PUT /Order/scheduled/{uuid}
 */
export const UpdateScheduledOrderDTOSchema = z
  .object({
    orderId: z.string().uuid({ message: 'Некорректный ID заказа' }),
    tariffId: z
      .string({ required_error: 'Выберите тариф' })
      .uuid({ message: 'Выберите корректный тариф' }),
    routeId: z.string().uuid({ message: 'Некорректный маршрут' }).nullable().optional(),
    startLocationId: z
      .string()
      .uuid({ message: 'Некорректная начальная точка' })
      .nullable()
      .optional(),
    endLocationId: z
      .string()
      .uuid({ message: 'Некорректная конечная точка' })
      .nullable()
      .optional(),
    additionalStops: z
      .array(z.string().uuid({ message: 'Некорректная промежуточная точка' }))
      .default([]),
    services: z.array(OrderServiceDTOSchema).default([]),
    initialPrice: z
      .number({ required_error: 'Укажите стоимость' })
      .min(0, { message: 'Стоимость не может быть отрицательной' }),
    scheduledTime: createDateTimeTransform().refine(val => val && val.length > 0, {
      message: 'Укажите время',
    }),
    passengers: z
      .array(UpdatePassengerDTOSchema)
      .min(1, { message: 'Добавьте хотя бы одного пассажира' }),
    status: OrderStatusSchema,

    // Дополнительные поля заказа
    description: z
      .string()
      .max(511, { message: 'Описание не должно превышать 511 символов' })
      .nullable()
      .optional(),
    airFlight: z
      .string()
      .max(63, { message: 'Номер рейса прилета не должен превышать 63 символа' })
      .nullable()
      .optional(),
    flyReis: z
      .string()
      .max(20, { message: 'Номер рейса вылета не должен превышать 20 символов' })
      .regex(/^[A-Z0-9\s-]+$/, {
        message:
          'Номер рейса вылета должен содержать только заглавные буквы, цифры, пробелы и дефисы',
      })
      .nullable()
      .optional(),
  })
  .refine(
    data => {
      // Проверяем, что указан либо routeId, либо startLocationId и endLocationId
      if (data.routeId) {
        return true; // Если есть шаблон маршрута, то локации не обязательны
      }

      return data.startLocationId && data.endLocationId; // Иначе обе локации обязательны
    },
    {
      message: 'Необходимо указать либо шаблон маршрута, либо начальную и конечную точки',
      path: ['routeId'],
    },
  )
  .refine(
    data => {
      // Проверяем, что есть хотя бы один главный пассажир
      const mainPassengers = data.passengers.filter(p => p.isMainPassenger);

      return mainPassengers.length === 1;
    },
    {
      message: 'Должен быть ровно один главный пассажир',
      path: ['passengers'],
    },
  );

/**
 * Тип, выведенный из схемы UpdateScheduledOrderDTOSchema
 */
export type UpdateScheduledOrderDTOType = z.infer<typeof UpdateScheduledOrderDTOSchema>;
