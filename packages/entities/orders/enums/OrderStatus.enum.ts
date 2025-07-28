/**
 * `Pending` = Заказ создан, но водитель еще не назначен<br>`Scheduled` = водитель назначен на заказ<br>`InProgress` = поездка выполняется<br>`Completed` = поездка успешно завершена<br>`Cancelled` = заказ отменен (клиентом, водителем или оператором)<br>`Expired` = истекло время ожидания подтверждения водителем
 * @enum
 */
export enum OrderStatus {
  Pending = 'Pending',
  Scheduled = 'Scheduled',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Expired = 'Expired',
}
/**
 * Массив всех значений OrderStatus
 */
export const OrderStatusValues = [
  OrderStatus.Pending,
  OrderStatus.Scheduled,
  OrderStatus.InProgress,
  OrderStatus.Completed,
  OrderStatus.Cancelled,
  OrderStatus.Expired,
];