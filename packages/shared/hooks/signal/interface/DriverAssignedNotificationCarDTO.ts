import type { CarColor } from '../enums';

/**
 * Интерфейс DriverAssignedNotificationCarDTO
 * @interface
 */
export interface DriverAssignedNotificationCarDTO {
  id: string;
  model: string;
  color: CarColor;
  licensePlate: string;
}