import type { GetOrderDTO } from './GetOrderDTO';

/**
 * Интерфейс GetOrderDTOKeysetPaginationResult
 * @interface
 */
export interface GetOrderDTOKeysetPaginationResult {
  /**
   * Данные заказов
   */
  data: GetOrderDTO[];
  
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
