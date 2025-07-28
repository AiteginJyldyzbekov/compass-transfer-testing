import { z } from 'zod';
import { LocationBaseDTOSchema } from '@entities/locations/schemas/LocationBaseDTO.schema';

/**
 * Схема валидации для GetLocationDTO
 */
export const GetLocationDTOSchema = LocationBaseDTOSchema.extend({
  id: z
    .string()
    .uuid({ message: 'Некорректный формат UUID' })
    .describe('Идентификатор локации')
});
/**
 * Тип, выведенный из схемы GetLocationDTOSchema
 */
export type GetLocationDTOType = z.infer<typeof GetLocationDTOSchema>;