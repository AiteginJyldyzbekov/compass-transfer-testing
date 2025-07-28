import { z } from 'zod';
import { GetTariffDTOSchema } from '@entities/tariffs/schemas/GetTariffDTO.schema';

/**
 * Схема валидации для GetTariffDTOKeysetPaginationResult
 */
export const GetTariffDTOKeysetPaginationResultSchema = z.object({
  data: z.lazy(() => GetTariffDTOSchema).optional(),
  totalCount: z.number().int().optional(),
  pageSize: z.number().int().optional(),
  hasPrevious: z.boolean().optional(),
  hasNext: z.boolean().optional()
});
/**
 * Тип, выведенный из схемы GetTariffDTOKeysetPaginationResultSchema
 */
export type GetTariffDTOKeysetPaginationResultType = z.infer<typeof GetTariffDTOKeysetPaginationResultSchema>;