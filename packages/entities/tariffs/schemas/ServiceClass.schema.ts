import { z } from 'zod';

/**
 * Схема валидации для перечисления ServiceClass
 */
export const ServiceClassSchema = z.enum(['Economy', 'Comfort', 'ComfortPlus', 'Business', 'Premium', 'Vip', 'Luxury']);
/**
 * Тип, выведенный из схемы ServiceClassSchema
 */
export type ServiceClassType = z.infer<typeof ServiceClassSchema>;