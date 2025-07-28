import type { GetRideDTO } from './GetRideDTO';

/**
 * Ответ с пагинацией для поездок
 * @interface
 */
export interface PaginatedRidesResponse {
  data: GetRideDTO[];
  total: number;
  page: number;
  limit: number;
}
