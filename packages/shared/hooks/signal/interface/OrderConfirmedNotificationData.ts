/**
 * Интерфейс OrderConfirmedNotificationData
 * Данные уведомления о подтверждении заказа
 * @interface
 */
export interface OrderConfirmedNotificationData {
  /** Идентификатор заказа */
  orderId?: string;
  /** Время подтверждения */
  confirmedAt?: string;
  /** Подтвердивший пользователь */
  confirmedBy?: string;
  /** Дополнительная информация */
  notes?: string;
}
