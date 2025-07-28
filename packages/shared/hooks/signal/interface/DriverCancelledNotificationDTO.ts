import type { NotificationType } from '@shared/hooks/signal/types';
import type { DriverCancelledNotificationData } from './DriverCancelledNotificationData';

/**
 * Интерфейс DriverCancelledNotificationDTO
 * Уведомление об отмене поездки водителем
 * @interface
 */
export interface DriverCancelledNotificationDTO {
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
  data: DriverCancelledNotificationData;
}
