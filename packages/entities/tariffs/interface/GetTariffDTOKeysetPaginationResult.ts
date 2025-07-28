import type { GetTariffDTO } from './GetTariffDTO';

/**
 * Интерфейс GetTariffDTOKeysetPaginationResult
 * @interface
 */
export interface GetTariffDTOKeysetPaginationResult {
  data: GetTariffDTO[];
  totalCount: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
