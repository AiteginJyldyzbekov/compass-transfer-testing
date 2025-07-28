/**
 * `Active` = Активен<br>`Inactive` = Неактивен<br>`Suspended` = Приостановлен<br>`Blocked` = Заблокирован<br>`OnVacation` = В отпуске
 * @enum
 */
export enum ActivityStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Suspended = 'Suspended',
  Blocked = 'Blocked',
  OnVacation = 'OnVacation',
}
/**
 * Массив всех значений ActivityStatus
 */
export const ActivityStatusValues = [
  ActivityStatus.Active,
  ActivityStatus.Inactive,
  ActivityStatus.Suspended,
  ActivityStatus.Blocked,
  ActivityStatus.OnVacation,
];
