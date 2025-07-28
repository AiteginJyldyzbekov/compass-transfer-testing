import type { NotificationType, RideRequestNotificationData } from '../enums';

/**
 * Интерфейс RideRequestNotificationDTO
 * @interface
 */
export interface RideRequestNotificationDTO {
  id?: string;
  type?: NotificationType;
  title: string;
  content?: string | null;
  orderId?: string | null;
  rideId?: string | null;
  orderType: 'Instant' | 'Scheduled';
  data: RideRequestNotificationData;
}