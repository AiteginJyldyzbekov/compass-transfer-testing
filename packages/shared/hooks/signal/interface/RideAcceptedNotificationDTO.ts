import type { NotificationType, DriverAssignedNotificationData } from '../enums';

/**
 * Интерфейс RideAcceptedNotificationDTO
 * @interface
 */
export interface RideAcceptedNotificationDTO {
  id?: string;
  type?: NotificationType;
  title: string;
  content?: string | null;
  orderId?: string | null;
  rideId?: string | null;
  orderType: 'Instant' | 'Scheduled';
  data: DriverAssignedNotificationData;
}