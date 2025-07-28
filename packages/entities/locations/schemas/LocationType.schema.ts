import { z } from 'zod';

/**
 * Схема валидации для перечисления LocationType
 */
export const LocationTypeSchema = z.enum(['Home', 'Work', 'Airport', 'Station', 'Hotel', 'Restaurant', 'Shop', 'Entertainment', 'Medical', 'Educational', 'BusinessCenter', 'Other']);
/**
 * Тип, выведенный из схемы LocationTypeSchema
 */
export type LocationTypeType = z.infer<typeof LocationTypeSchema>;