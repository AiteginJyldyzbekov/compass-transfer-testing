/**
 * Интерфейс RideRejectedNotificationData
 * Данные уведомления об отклонении поездки
 * @interface
 */
export interface RideRejectedNotificationData {
  /** Идентификатор поездки */
  rideId?: string;
  /** Время отклонения */
  rejectedAt?: string;
  /** Отклонивший пользователь */
  rejectedBy?: string;
  /** Причина отклонения */
  reason?: string;
}
