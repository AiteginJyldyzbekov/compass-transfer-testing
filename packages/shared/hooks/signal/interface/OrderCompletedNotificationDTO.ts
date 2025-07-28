import type { NotificationType } from '@shared/hooks/signal/types';
import type { OrderCompletedNotificationData } from './OrderCompletedNotificationData';

/**
 * Интерфейс OrderCompletedNotificationDTO
 * Уведомление о завершении заказа
 * @interface
 */
export interface OrderCompletedNotificationDTO {
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
  data: OrderCompletedNotificationData;
}
