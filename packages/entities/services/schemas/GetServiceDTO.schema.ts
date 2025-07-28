import { z } from 'zod';
import { ServiceDTOSchema } from '@entities/services/schemas/ServiceDTO.schema';

/**
 * Схема валидации для GetServiceDTO
 */
export const GetServiceDTOSchema = ServiceDTOSchema.extend({
  id: z
    .string()
    .uuid({ message: 'Некорректный формат UUID' })
    .describe('Идентификатор услуги'),
});
/**
 * Тип, выведенный из схемы GetServiceDTOSchema
 */
export type GetServiceDTOType = z.infer<typeof GetServiceDTOSchema>;
