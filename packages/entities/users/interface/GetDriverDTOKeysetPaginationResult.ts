import type { GetDriverDTO } from '@entities/users/interface/GetDriverDTO';

/**
 * Интерфейс GetDriverDTOKeysetPaginationResult
 * @interface
 */
export interface GetDriverDTOKeysetPaginationResult {
  data?: GetDriverDTO;
  totalCount?: number;
  pageSize?: number;
  hasPrevious?: boolean;
  hasNext?: boolean;
}