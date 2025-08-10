/**
 * `Available` = Доступен<br>`Maintenance` = На обслуживании<br>`Repair` = На ремонте<br>`Other` = Другое
 * @enum
 */
export enum VehicleStatus {
  Available = 'Available',
  Maintenance = 'Maintenance',
  Repair = 'Repair',
  Other = 'Other',
}
/**
 * Массив всех значений VehicleStatus
 */
export const VehicleStatusValues = [
  VehicleStatus.Available,
  VehicleStatus.Maintenance,
  VehicleStatus.Repair,
  VehicleStatus.Other,
];


// Переводы для статусов автомобилей
export const vehicleStatusLabels: Record<VehicleStatus, string> = {
  [VehicleStatus.Available]: 'Доступен',
  [VehicleStatus.Maintenance]: 'На обслуживании',
  [VehicleStatus.Repair]: 'На ремонте',
  [VehicleStatus.Other]: 'Другое',
};