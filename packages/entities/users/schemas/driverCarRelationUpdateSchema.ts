import { z } from 'zod';

/**
 * Схема валидации для обновления связи автомобиль-водитель (со стороны водителя)
 * Используется при изменении существующего назначения (PUT запросы)
 */
export const driverCarRelationUpdateSchema = z
  .object({
    /**
     * ID водителя
     * Обязательное поле для идентификации связи
     */
    driverId: z
      .string()
      .uuid('ID водителя должен быть валидным UUID')
      .min(1, 'ID водителя обязателен'),

    /**
     * ID автомобиля
     * Обязательное поле для идентификации связи
     */
    carId: z
      .string()
      .uuid('ID автомобиля должен быть валидным UUID')
      .min(1, 'ID автомобиля обязателен'),

    /**
     * Новая дата начала назначения (опционально)
     * Может быть изменена при обновлении
     */
    startDate: z.string().datetime('Дата должна быть в формате ISO 8601').optional(),

    /**
     * Дата окончания назначения (опционально)
     * Устанавливается при завершении назначения
     */
    endDate: z.string().datetime('Дата должна быть в формате ISO 8601').optional(),

    /**
     * Активность связи (основное поле для PUT запросов)
     * true = активная связь, false = неактивная связь
     */
    isActive: z
      .boolean({
        message: 'IsActive должен быть булевым значением',
      })
      .optional(),

    /**
     * Статус назначения (опционально, для расширенного управления)
     */
    status: z
      .enum(['Active', 'Inactive', 'Suspended'], {
        message: 'Статус должен быть Active, Inactive или Suspended',
      })
      .optional(),

    /**
     * Обновленные примечания к назначению (опционально)
     */
    notes: z.string().max(500, 'Примечания не должны превышать 500 символов').optional(),
  })
  .refine(
    data => {
      // Если указаны обе даты, endDate должна быть после startDate
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) > new Date(data.startDate);
      }

      return true;
    },
    {
      message: 'Дата окончания должна быть позже даты начала',
      path: ['endDate'],
    },
  );

/**
 * Схема для частичного обновления связи автомобиль-водитель
 * Все поля опциональны, кроме идентификаторов
 */
export const driverCarRelationPartialUpdateSchema = z.object({
  /**
   * ID водителя (обязательно для идентификации)
   */
  driverId: z
    .string()
    .uuid('ID водителя должен быть валидным UUID')
    .min(1, 'ID водителя обязателен'),

  /**
   * ID автомобиля (обязательно для идентификации)
   */
  carId: z
    .string()
    .uuid('ID автомобиля должен быть валидным UUID')
    .min(1, 'ID автомобиля обязателен'),

  /**
   * Поля для частичного обновления (все опциональны)
   */
  updates: z
    .object({
      startDate: z.string().datetime('Дата должна быть в формате ISO 8601').optional(),

      endDate: z.string().datetime('Дата должна быть в формате ISO 8601').optional(),

      isActive: z
        .boolean({
          message: 'IsActive должен быть булевым значением',
        })
        .optional(),

      status: z
        .enum(['Active', 'Inactive', 'Suspended'], {
          message: 'Статус должен быть Active, Inactive или Suspended',
        })
        .optional(),

      notes: z.string().max(500, 'Примечания не должны превышать 500 символов').optional(),
    })
    .partial(),
});

/**
 * Типы для обновления связей
 */
export type DriverCarRelationUpdate = z.infer<typeof driverCarRelationUpdateSchema>;
export type DriverCarRelationPartialUpdate = z.infer<typeof driverCarRelationPartialUpdateSchema>;
