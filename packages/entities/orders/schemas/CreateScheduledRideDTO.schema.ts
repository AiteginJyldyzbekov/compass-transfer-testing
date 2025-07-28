import { z } from 'zod';
import { createDateTimeTransform } from '@shared/lib/utils';

/**
 * Схема валидации для waypoint в поездке
 */
export const RideWaypointSchema = z
  .object({
    /**
     * ID локации
     */
    locationId: z
      .string({ required_error: 'Выберите локацию' })
      .uuid({ message: 'Выберите корректную локацию' }),

    /**
     * Время прибытия на точку (опционально)
     */
    arrivalTime: createDateTimeTransform().nullable().optional(),

    /**
     * Время отправления с точки (опционально)
     */
    departureTime: createDateTimeTransform().nullable().optional(),
  })
  .refine(
    data => {
      // Если указаны оба времени, время отправления должно быть после прибытия
      if (data.arrivalTime && data.departureTime) {
        return new Date(data.departureTime) > new Date(data.arrivalTime);
      }

      return true;
    },
    {
      message: 'Время отправления должно быть позже времени прибытия',
      path: ['departureTime'],
    },
  );

/**
 * Схема валидации для создания поездки по запланированному заказу
 * POST /Order/scheduled/{uuid}/ride
 */
export const CreateScheduledRideDTOSchema = z.object({
  /**
   * ID водителя (обязательно)
   */
  driverId: z
    .string({ required_error: 'Выберите водителя' })
    .uuid({ message: 'Выберите корректного водителя' }),

  /**
   * ID автомобиля (обязательно)
   */
  carId: z
    .string({ required_error: 'Выберите автомобиль' })
    .uuid({ message: 'Выберите корректный автомобиль' }),

  /**
   * Промежуточные точки маршрута поездки (технические остановки для водителя)
   */
  waypoints: z
    .array(RideWaypointSchema)
    .min(1, { message: 'Добавьте хотя бы одну точку маршрута' })
    .default([]),
});

/**
 * Схема для обновления поездки
 */
export const UpdateScheduledRideDTOSchema = CreateScheduledRideDTOSchema.partial().extend({
  /**
   * ID поездки для обновления
   */
  rideId: z
    .string({ required_error: 'ID поездки обязателен' })
    .uuid({ message: 'Некорректный ID поездки' }),
});

/**
 * Типы, выведенные из схем
 */
export type RideWaypointType = z.infer<typeof RideWaypointSchema>;
export type CreateScheduledRideDTOType = z.infer<typeof CreateScheduledRideDTOSchema>;
export type UpdateScheduledRideDTOType = z.infer<typeof UpdateScheduledRideDTOSchema>;
