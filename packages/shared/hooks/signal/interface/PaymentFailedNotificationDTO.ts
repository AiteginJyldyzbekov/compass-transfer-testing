import type { NotificationType } from '@entities/notifications/enums';
import type { PaymentFailedNotificationData } from './PaymentFailedNotificationData';

/**
 * Интерфейс PaymentFailedNotificationDTO
 * Уведомление о неудачном платеже
 * @interface
 */
export interface PaymentFailedNotificationDTO {
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
  data: PaymentFailedNotificationData;
}
