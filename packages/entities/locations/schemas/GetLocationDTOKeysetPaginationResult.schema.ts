import { z } from 'zod';
import { GetLocationDTOSchema } from '@entities/locations/schemas/GetLocationDTO.schema';

/**
 * Схема валидации для GetLocationDTOKeysetPaginationResult
 */
export const GetLocationDTOKeysetPaginationResultSchema = z.object({
  data: z.array(GetLocationDTOSchema).describe('Данные локаций'),
  totalCount: z.number().int().describe('Общее количество записей'),
  pageSize: z.number().int().describe('Размер страницы'),
  hasPrevious: z.boolean().describe('Есть ли предыдущая страница'),
  hasNext: z.boolean().describe('Есть ли следующая страница')
});
/**
 * Тип, выведенный из схемы GetLocationDTOKeysetPaginationResultSchema
 */
export type GetLocationDTOKeysetPaginationResultType = z.infer<typeof GetLocationDTOKeysetPaginationResultSchema>;