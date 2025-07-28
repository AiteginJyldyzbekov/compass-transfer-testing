import type { NotificationType } from '@entities/notifications/enums';
import type { RideStartedNotificationData } from './RideStartedNotificationData';

/**
 * Интерфейс RideStartedNotificationDTO
 * Уведомление о начале поездки
 * @interface
 */
export interface RideStartedNotificationDTO {
  /** Уникальный идентификатор уведомления */
  id?: string;
  /** Тип уведомления */
  type?: NotificationType;
  /** Заголовок уведомления */
  title: string;
  /** Текст уведомления */
  content?: string | null;
  /** Идентификатор связанного заказа */
  orderId?: string | null;
  /** Идентификатор связанной поездки */
  rideId?: string | null;
  /** Тип заказа */
  orderType: 'Instant' | 'Scheduled';
  /** Данные уведомления */
  data: RideStartedNotificationData;
}
