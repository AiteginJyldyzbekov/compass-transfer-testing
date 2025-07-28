import type { DriverAssignedNotificationCarDTO } from './DriverAssignedNotificationCarDTO';
import type { DriverAssignedNotificationDriverDTO } from './DriverAssignedNotificationDriverDTO';
import type { NotificationLocationDTO } from './NotificationLocationDTO';

/**
 * Интерфейс DriverArrivedNotificationData
 * Данные уведомления о прибытии водителя к месту посадки
 * @interface
 */
export interface DriverArrivedNotificationData {
  /** Текущее местоположение водителя */
  driverCurrentLocation?: NotificationLocationDTO;
  /** Время прибытия */
  arrivedAt?: string;
  /** Информация о водителе */
  driver?: DriverAssignedNotificationDriverDTO;
  /** Информация о машине */
  car?: DriverAssignedNotificationCarDTO;
}
