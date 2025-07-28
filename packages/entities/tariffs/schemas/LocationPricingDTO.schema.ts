import { z } from 'zod';

/**
 * Схема валидации для LocationPricingDTO
 */
export const LocationPricingDTOSchema = z.object({
  fromId: z.string().uuid(),
  toId: z.string().uuid(),
  tariffId: z.string().uuid(),
  basePrice: z.number()
});
/**
 * Тип, выведенный из схемы LocationPricingDTOSchema
 */
export type LocationPricingDTOType = z.infer<typeof LocationPricingDTOSchema>;