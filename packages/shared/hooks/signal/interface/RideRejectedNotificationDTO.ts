import type { NotificationType } from '@entities/notifications/enums';
import type { RideRejectedNotificationData } from './RideRejectedNotificationData';

/**
 * Интерфейс RideRejectedNotificationDTO
 * Уведомление об отклонении поездки
 * @interface
 */
export interface RideRejectedNotificationDTO {
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
  /** Данные уведомления */
  data: RideRejectedNotificationData;
}
