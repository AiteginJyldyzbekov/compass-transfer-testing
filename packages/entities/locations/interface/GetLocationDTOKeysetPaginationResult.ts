import type { GetLocationDTO } from '@entities/locations/interface/GetLocationDTO';

/**
 * Интерфейс для результата пагинации списка локаций
 * @interface GetLocationDTOKeysetPaginationResult
 */
export interface GetLocationDTOKeysetPaginationResult {
  data: GetLocationDTO[];
  totalCount: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
