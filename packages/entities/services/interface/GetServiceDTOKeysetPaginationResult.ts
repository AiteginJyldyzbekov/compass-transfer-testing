import type { GetServiceDTO } from '@entities/services/interface/GetServiceDTO';

/**
 * Интерфейс GetServiceDTOKeysetPaginationResult
 * @interface
 */
export interface GetServiceDTOKeysetPaginationResult {
  data?: GetServiceDTO;
  totalCount?: number;
  pageSize?: number;
  hasPrevious?: boolean;
  hasNext?: boolean;
}