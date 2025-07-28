import { z } from 'zod';

/**
 * Схема валидации для создания связи автомобиль-водитель (со стороны водителя)
 * Используется при назначении автомобиля водителю (POST запросы)
 */
export const driverCarRelationCreateSchema = z.object({
  /**
   * ID водителя
   * Обязательное поле при создании связи
   */
  driverId: z.string()
    .uuid('ID водителя должен быть валидным UUID')
    .min(1, 'ID водителя обязателен'),
  
  /**
   * ID автомобиля
   * Обязательное поле при создании связи
   */
  carId: z.string()
    .uuid('ID автомобиля должен быть валидным UUID')
    .min(1, 'ID автомобиля обязателен'),
  
  /**
   * Дата начала назначения (опционально)
   * По умолчанию - текущая дата
   */
  startDate: z.string()
    .datetime('Дата должна быть в формате ISO 8601')
    .optional(),
  
  /**
   * Примечания к назначению (опционально)
   */
  notes: z.string()
    .max(500, 'Примечания не должны превышать 500 символов')
    .optional(),
});

/**
 * Схема для назначения водителю одного автомобиля
 * Водитель может быть назначен только на один автомобиль
 */
export const driverCarRelationSingleCreateSchema = z.object({
  /**
   * ID водителя
   */
  driverId: z.string()
    .uuid('ID водителя должен быть валидным UUID')
    .min(1, 'ID водителя обязателен'),
  
  /**
   * ID автомобиля для назначения
   */
  carId: z.string()
    .uuid('ID автомобиля должен быть валидным UUID')
    .min(1, 'ID автомобиля обязателен'),
  
  /**
   * Дата начала назначения (опционально)
   */
  startDate: z.string()
    .datetime('Дата должна быть в формате ISO 8601')
    .optional(),
  
  /**
   * Примечания к назначению (опционально)
   */
  notes: z.string()
    .max(500, 'Примечания не должны превышать 500 символов')
    .optional(),
});

/**
 * Типы для создания связей
 */
export type DriverCarRelationCreate = z.infer<typeof driverCarRelationCreateSchema>;
export type DriverCarRelationSingleCreate = z.infer<typeof driverCarRelationSingleCreateSchema>;
