import type { NotificationType } from '@entities/notifications/enums';
import type { PaymentReceivedNotificationData } from './PaymentReceivedNotificationData';

/**
 * Интерфейс PaymentReceivedNotificationDTO
 * Уведомление о получении платежа
 * @interface
 */
export interface PaymentReceivedNotificationDTO {
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
  data: PaymentReceivedNotificationData;
}
