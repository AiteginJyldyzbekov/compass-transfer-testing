import { z } from 'zod';

/**
 * Схема валидации для перечисления OrderStatus
 */
export const OrderStatusSchema = z.enum(['Pending', 'Scheduled', 'InProgress', 'Completed', 'Cancelled', 'Expired']);
/**
 * Тип, выведенный из схемы OrderStatusSchema
 */
export type OrderStatusType = z.infer<typeof OrderStatusSchema>;