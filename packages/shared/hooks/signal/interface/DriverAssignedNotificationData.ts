import type { DriverAssignedNotificationCarDTO } from './DriverAssignedNotificationCarDTO';
import type { DriverAssignedNotificationDriverDTO } from './DriverAssignedNotificationDriverDTO';

/**
 * Интерфейс DriverAssignedNotificationData
 * @interface
 */
export interface DriverAssignedNotificationData {
  driver: DriverAssignedNotificationDriverDTO;
  car: DriverAssignedNotificationCarDTO;
}