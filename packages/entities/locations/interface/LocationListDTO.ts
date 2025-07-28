import type { LocationDTO } from './LocationDTO';

/**
 * Интерфейс для ответа API GET /Location
 */
export interface LocationListResponseDTO {
  /** Массив локаций */
  data: LocationDTO[];
  /** Общее количество записей */
  totalCount: number;
  /** Размер страницы */
  pageSize: number;
  /** Есть ли предыдущая страница */
  hasPrevious: boolean;
  /** Есть ли следующая страница */
  hasNext: boolean;
}
