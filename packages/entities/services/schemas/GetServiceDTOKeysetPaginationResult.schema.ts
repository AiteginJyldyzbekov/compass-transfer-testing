import { z } from 'zod';
import { GetServiceDTOSchema } from '@entities/services/schemas/GetServiceDTO.schema';

/**
 * Схема валидации для GetServiceDTOKeysetPaginationResult
 */
export const GetServiceDTOKeysetPaginationResultSchema = z.object({
  data: z.array(GetServiceDTOSchema).describe('Данные услуг'),
  totalCount: z.number().int().describe('Общее количество записей'),
  pageSize: z.number().int().describe('Размер страницы'),
  hasPrevious: z.boolean().describe('Есть ли предыдущая страница'),
  hasNext: z.boolean().describe('Есть ли следующая страница'),
});
/**
 * Тип, выведенный из схемы GetServiceDTOKeysetPaginationResultSchema
 */
export type GetServiceDTOKeysetPaginationResultType = z.infer<typeof GetServiceDTOKeysetPaginationResultSchema>;
