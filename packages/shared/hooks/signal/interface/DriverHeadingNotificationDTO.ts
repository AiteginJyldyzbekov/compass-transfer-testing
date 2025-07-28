import type { NotificationType } from '@shared/hooks/signal/types';
import type { DriverHeadingNotificationData } from './DriverHeadingNotificationData';

/**
 * Интерфейс DriverHeadingNotificationDTO
 * @interface
 */
export interface DriverHeadingNotificationDTO {
  id?: string;
  type?: NotificationType;
  title: string;
  content?: string | null;
  orderId?: string | null;
  rideId?: string | null;
  data: DriverHeadingNotificationData;
}