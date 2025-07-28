import type { NotificationType } from '@shared/hooks/signal/types';
import type { DriverArrivedNotificationData } from './DriverArrivedNotificationData';

/**
 * Интерфейс DriverArrivedNotificationDTO
 * Уведомление о прибытии водителя к месту посадки
 * @interface
 */
export interface DriverArrivedNotificationDTO {
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
  data: DriverArrivedNotificationData;
}
