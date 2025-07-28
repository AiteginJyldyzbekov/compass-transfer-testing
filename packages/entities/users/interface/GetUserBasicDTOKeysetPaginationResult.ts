import type { GetUserBasicDTO } from '@entities/users/interface/GetUserBasicDTO';

/**
 * Интерфейс GetUserBasicDTOKeysetPaginationResult
 * @interface
 */
export interface GetUserBasicDTOKeysetPaginationResult {
  data: GetUserBasicDTO[];
  totalCount?: number;
  pageSize?: number;
  hasPrevious?: boolean;
  hasNext?: boolean;
}
