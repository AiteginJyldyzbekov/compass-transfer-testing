import type { NotificationType, RideCompletedNotificationData } from '../enums';

/**
 * Интерфейс RideCompletedNotificationDTO
 * @interface
 */
export interface RideCompletedNotificationDTO {
  id?: string;
  type?: NotificationType;
  title: string;
  content?: string | null;
  orderId?: string | null;
  rideId?: string | null;
  orderType: 'Instant' | 'Scheduled';
  data: RideCompletedNotificationData;
}