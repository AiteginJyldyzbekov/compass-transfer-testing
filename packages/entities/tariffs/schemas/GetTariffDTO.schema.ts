import { z } from 'zod';
import { TariffBaseDTORawSchema } from '@entities/tariffs/schemas/TariffBaseDTO.schema';

/**
 * Схема валидации для GetTariffDTO
 */
export const GetTariffDTOSchema = TariffBaseDTORawSchema.extend({
  id: z.string().uuid({ message: 'Некорректный формат UUID' }).describe('Идентификатор тарифа'),
}).transform(d => d);

/**
 * Тип, выведенный из схемы GetTariffDTOSchema
 */
export type GetTariffDTOType = z.infer<typeof GetTariffDTOSchema>;
