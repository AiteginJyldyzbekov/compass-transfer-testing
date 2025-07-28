/**
 * `Requested` = Запрошена<br>`Searching` = Поиск водителя<br>`Accepted` = Принята водителем<br>`Arrived` = Водитель прибыл<br>`InProgress` = В процессе<br>`Completed` = Завершена<br>`Cancelled` = Отменена
 * @enum
 */
export enum RideStatus {
  Requested = 'Requested',
  Searching = 'Searching',
  Accepted = 'Accepted',
  Arrived = 'Arrived',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}
/**
 * Массив всех значений RideStatus
 */
export const RideStatusValues = [
  RideStatus.Requested,
  RideStatus.Searching,
  RideStatus.Accepted,
  RideStatus.Arrived,
  RideStatus.InProgress,
  RideStatus.Completed,
  RideStatus.Cancelled,
];