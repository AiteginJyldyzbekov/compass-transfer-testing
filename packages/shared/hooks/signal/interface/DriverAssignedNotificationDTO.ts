import type { NotificationType, DriverAssignedNotificationData } from '../enums';

/**
 * Интерфейс DriverAssignedNotificationDTO
 * @interface
 */
export interface DriverAssignedNotificationDTO {
  id?: string;
  type?: NotificationType;
  title: string;
  content?: string | null;
  orderId?: string | null;
  rideId?: string | null;
  data: DriverAssignedNotificationData;
}