/**
 * DTO для статистики заказов
 */
export interface OrderStatsDTO {
  /** Количество заказов в ожидании */
  pending: number;
  /** Количество запланированных заказов */
  scheduled: number;
  /** Количество заказов в процессе выполнения */
  inProgress: number;
  /** Количество завершенных заказов */
  completed: number;
  /** Количество отмененных заказов */
  cancelled: number;
  /** Количество заказов с истекшим сроком */
  expired: number;
}
