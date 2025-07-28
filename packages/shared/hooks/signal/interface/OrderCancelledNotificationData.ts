/**
 * Интерфейс OrderCancelledNotificationData
 * Данные уведомления об отмене заказа
 * @interface
 */
export interface OrderCancelledNotificationData {
  /** Идентификатор заказа */
  orderId?: string;
  /** Время отмены */
  cancelledAt?: string;
  /** Отменивший пользователь */
  cancelledBy?: string;
  /** Причина отмены */
  reason?: string;
}
