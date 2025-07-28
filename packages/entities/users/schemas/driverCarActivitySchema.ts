import { z } from 'zod';

/**
 * Схема валидации для управления активным автомобилем водителя
 * Используется в профиле водителя для самостоятельного управления
 */
export const driverCarActivityManagementSchema = z.object({
  /**
   * ID автомобиля для операций
   */
  carId: z.string()
    .uuid('ID автомобиля должен быть валидным UUID')
    .min(1, 'ID автомобиля обязателен'),
  
  /**
   * Тип операции
   */
  action: z.enum(['activate', 'deactivate'], {
    errorMap: () => ({ message: 'Действие должно быть activate или deactivate' }),
  }),
  
  /**
   * Причина изменения (опционально)
   */
  reason: z.string()
    .max(200, 'Причина не должна превышать 200 символов')
    .optional(),
});

/**
 * Схема для обновления активного автомобиля в профиле водителя
 */
export const driverActiveCarUpdateSchema = z.object({
  /**
   * ID активного автомобиля (null для деактивации)
   */
  activeCarId: z.string()
    .uuid('ID автомобиля должен быть валидным UUID')
    .nullable(),
  
  /**
   * Временная метка изменения
   */
  updatedAt: z.string()
    .datetime('Дата должна быть в формате ISO 8601')
    .optional(),
});

/**
 * Схема для валидации доступных автомобилей водителя
 */
export const driverAvailableCarsSchema = z.object({
  /**
   * Список ID доступных автомобилей
   */
  availableCarIds: z.array(
    z.string().uuid('ID автомобиля должен быть валидным UUID')
  ).min(0, 'Список может быть пустым'),
  
  /**
   * ID текущего активного автомобиля
   */
  activeCarId: z.string()
    .uuid('ID автомобиля должен быть валидным UUID')
    .nullable(),
});

/**
 * Схема для проверки возможности активации автомобиля
 */
export const carActivationEligibilitySchema = z.object({
  /**
   * ID автомобиля для проверки
   */
  carId: z.string()
    .uuid('ID автомобиля должен быть валидным UUID'),
  
  /**
   * ID водителя
   */
  driverId: z.string()
    .uuid('ID водителя должен быть валидным UUID'),
  
  /**
   * Результат проверки
   */
  isEligible: z.boolean(),
  
  /**
   * Причина, если не может активировать
   */
  reason: z.string().optional(),
});

/**
 * Схема для истории активации автомобилей
 */
export const driverCarActivityHistorySchema = z.object({
  /**
   * ID записи
   */
  id: z.string().uuid(),
  
  /**
   * ID водителя
   */
  driverId: z.string().uuid(),
  
  /**
   * ID автомобиля
   */
  carId: z.string().uuid(),
  
  /**
   * Тип действия
   */
  action: z.enum(['activated', 'deactivated']),
  
  /**
   * Временная метка
   */
  timestamp: z.string().datetime(),
  
  /**
   * Причина (если указана)
   */
  reason: z.string().optional(),
});

/**
 * Типы для управления активным автомобилем водителя
 */
export type DriverCarActivityManagement = z.infer<typeof driverCarActivityManagementSchema>;
export type DriverActiveCarUpdate = z.infer<typeof driverActiveCarUpdateSchema>;
export type DriverAvailableCars = z.infer<typeof driverAvailableCarsSchema>;
export type CarActivationEligibility = z.infer<typeof carActivationEligibilitySchema>;
export type DriverCarActivityHistory = z.infer<typeof driverCarActivityHistorySchema>;