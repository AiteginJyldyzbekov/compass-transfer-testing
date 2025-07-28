import { z } from 'zod';

/**
 * Схема валидации для активации автомобиля водителем
 * Используется для POST /Car/my/{uuid}/set-active
 */
export const driverCarSetActiveSchema = z.object({
  /**
   * ID автомобиля для активации
   * Передается в path параметре
   */
  carId: z.string()
    .uuid('ID автомобиля должен быть валидным UUID')
    .min(1, 'ID автомобиля обязателен'),
});
/**
 * Схема валидации для деактивации автомобиля водителем
 * Используется для POST /Car/my/set-inactive
 */
export const driverCarSetInactiveSchema = z.object({
  /**
   * ID автомобиля для деактивации (опционально в query параметре)
   * Если не указан, деактивируется текущий активный автомобиль
   */
  carId: z.string()
    .uuid('ID автомобиля должен быть валидным UUID')
    .optional(),
});
/**
 * Схема для валидации path параметра UUID
 */
export const uuidPathParamSchema = z.string()
  .uuid('UUID должен быть валидным')
  .min(1, 'UUID обязателен');
/**
 * Схема для валидации query параметра UUID (опционально)
 */
export const uuidQueryParamSchema = z.string()
  .uuid('UUID должен быть валидным')
  .optional();
/**
 * Схема для ответа при успешной активации/деактивации
 */
export const driverCarActivityResponseSchema = z.object({
  /**
   * Сообщение об успешной операции
   */
  message: z.string(),
  
  /**
   * ID активного автомобиля (null при деактивации)
   */
  activeCarId: z.string().uuid().nullable(),
  
  /**
   * Временная метка операции
   */
  timestamp: z.string().datetime(),
});
/**
 * Схема для ошибки при активации/деактивации
 */
export const driverCarActivityErrorSchema = z.object({
  /**
   * Код ошибки
   */
  code: z.string(),
  
  /**
   * Сообщение об ошибке
   */
  message: z.string(),
  
  /**
   * Детали ошибки (опционально)
   */
  details: z.string().optional(),
});
/**
 * Типы для операций водителя с автомобилями
 */
export type DriverCarSetActive = z.infer<typeof driverCarSetActiveSchema>;
export type DriverCarSetInactive = z.infer<typeof driverCarSetInactiveSchema>;
export type UuidPathParam = z.infer<typeof uuidPathParamSchema>;
export type UuidQueryParam = z.infer<typeof uuidQueryParamSchema>;
export type DriverCarActivityResponse = z.infer<typeof driverCarActivityResponseSchema>;
export type DriverCarActivityError = z.infer<typeof driverCarActivityErrorSchema>;