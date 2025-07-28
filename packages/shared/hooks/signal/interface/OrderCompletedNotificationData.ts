/**
 * Интерфейс OrderCompletedNotificationData
 * Данные уведомления о завершении заказа
 * @interface
 */
export interface OrderCompletedNotificationData {
  /** Идентификатор заказа */
  orderId?: string;
  /** Время завершения */
  completedAt?: string;
  /** Общая стоимость */
  totalAmount?: number;
  /** Валюта */
  currency?: string;
  /** Оценка поездки */
  rating?: number;
}
