import type { NotificationType } from '@entities/notifications/enums';
import type { PaymentNotificationData } from './PaymentNotificationData';

/**
 * Интерфейс PaymentNotificationDTO
 * Уведомление о платеже
 * @interface
 */
export interface PaymentNotificationDTO {
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
  data: PaymentNotificationData;
}
