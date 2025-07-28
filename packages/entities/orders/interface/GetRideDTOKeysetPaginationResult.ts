import type { GetRideDTO } from './GetRideDTO';

/**
 * Интерфейс для результата пагинации списка поездок
 * @interface GetRideDTOKeysetPaginationResult
 */
export interface GetRideDTOKeysetPaginationResult {
  /**
   * Данные поездок
   */
  data: GetRideDTO[];

  /**
   * Общее количество записей
   */
  totalCount: number;

  /**
   * Размер страницы
   */
  pageSize: number;

  /**
   * Есть ли предыдущая страница
   */
  hasPrevious: boolean;

  /**
   * Есть ли следующая страница
   */
  hasNext: boolean;
}
