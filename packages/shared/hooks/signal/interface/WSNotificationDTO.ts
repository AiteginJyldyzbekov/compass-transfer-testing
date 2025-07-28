import type { NotificationType } from '../enums';

/**
 * Интерфейс WSNotificationDTO
 * @interface
 */
export interface WSNotificationDTO {
  id?: string;
  type?: NotificationType;
  title: string;
  content?: string | null;
  orderId?: string | null;
  rideId?: string | null;
  orderType?: 'Instant' | 'Scheduled';
}