import { z } from 'zod';

/**
 * Схема валидации для LocationPricingDTO
 */
export const LocationPricingDTOSchema = z.object({
  fromId: z
    .string()
    .uuid({ message: 'Некорректный формат UUID для fromId' })
    .describe('Идентификатор начальной локации'),
  toId: z
    .string()
    .uuid({ message: 'Некорректный формат UUID для toId' })
    .describe('Идентификатор конечной локации'),
  tariffId: z
    .string()
    .uuid({ message: 'Некорректный формат UUID для tariffId' })
    .describe('Идентификатор тарифа'),
  basePrice: z
    .number()
    .min(0, { message: 'Базовая цена должна быть не менее 0' })
    .describe('Базовая цена')
});
/**
 * Тип, выведенный из схемы LocationPricingDTOSchema
 */
export type LocationPricingDTOType = z.infer<typeof LocationPricingDTOSchema>;