import { z } from 'zod';

/**
 * Схема валидации для перечисления OrderType
 */
export const OrderTypeSchema = z.enum(['Unknown', 'Instant', 'Scheduled', 'Partner', 'Shuttle', 'Subscription']);
/**
 * Тип, выведенный из схемы OrderTypeSchema
 */
export type OrderTypeType = z.infer<typeof OrderTypeSchema>;