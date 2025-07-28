import { z } from 'zod';

/**
 * Схема валидации для обновления связи водитель-автомобиль
 * Используется при изменении существующего назначения (PUT запросы)
 * URL: PUT /Car/{uuid}/drivers/{driver_id}
 * Body: boolean (активна ли связь)
 */
export const carDriverRelationUpdateSchema = z.boolean({
  errorMap: () => ({ message: 'Значение должно быть булевым (true/false)' }),
});

/**
 * Схема для частичного обновления связи водитель-автомобиль
 * Используется для более сложных случаев обновления с дополнительными полями
 */
export const carDriverRelationPartialUpdateSchema = z.object({
  /**
   * ID автомобиля (обязательно для идентификации)
   */
  carId: z
    .string()
    .uuid('ID автомобиля должен быть валидным UUID')
    .min(1, 'ID автомобиля обязателен'),

  /**
   * ID водителя (обязательно для идентификации)
   */
  driverId: z
    .string()
    .uuid('ID водителя должен быть валидным UUID')
    .min(1, 'ID водителя обязателен'),

  /**
   * Поля для частичного обновления (все опциональны)
   */
  updates: z
    .object({
      startDate: z.string().datetime('Дата должна быть в формате ISO 8601').optional(),

      endDate: z.string().datetime('Дата должна быть в формате ISO 8601').optional(),

      isActive: z
        .boolean({
          errorMap: () => ({ message: 'IsActive должен быть булевым значением' }),
        })
        .optional(),

      status: z
        .enum(['Active', 'Inactive', 'Suspended'], {
          errorMap: () => ({ message: 'Статус должен быть Active, Inactive или Suspended' }),
        })
        .optional(),

      notes: z.string().max(500, 'Примечания не должны превышать 500 символов').optional(),
    })
    .partial(),
});

/**
 * Типы для обновления связей
 */
export type CarDriverRelationUpdate = z.infer<typeof carDriverRelationUpdateSchema>; // boolean
export type CarDriverRelationPartialUpdate = z.infer<typeof carDriverRelationPartialUpdateSchema>;
