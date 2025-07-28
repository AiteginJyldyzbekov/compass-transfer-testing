import type { DriverAssignedNotificationCarDTO } from './DriverAssignedNotificationCarDTO';
import type { DriverAssignedNotificationDriverDTO } from './DriverAssignedNotificationDriverDTO';

/**
 * Интерфейс DriverCancelledNotificationData
 * Данные уведомления об отмене поездки водителем
 * @interface
 */
export interface DriverCancelledNotificationData {
  /** Причина отмены */
  reason?: string;
  /** Время отмены */
  cancelledAt?: string;
  /** Информация о водителе */
  driver?: DriverAssignedNotificationDriverDTO;
  /** Информация о машине */
  car?: DriverAssignedNotificationCarDTO;
}
