import type { GetCarDTO } from '@entities/cars/interface/GetCarDTO';

/**
 * Интерфейс для результата пагинации списка автомобилей
 * @interface GetCarDTOKeysetPaginationResult
 */
export interface GetCarDTOKeysetPaginationResult {
  data: GetCarDTO[];
  totalCount: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
