import type { NotificationLocationDTO } from './NotificationLocationDTO';

/**
 * Интерфейс RideStartedNotificationData
 * Данные уведомления о начале поездки
 * @interface
 */
export interface RideStartedNotificationData {
  /** Идентификатор поездки */
  rideId?: string;
  /** Время начала */
  startedAt?: string;
  /** Начальная точка */
  startLocation?: NotificationLocationDTO;
  /** Ожидаемое время прибытия */
  estimatedArrival?: string;
}
