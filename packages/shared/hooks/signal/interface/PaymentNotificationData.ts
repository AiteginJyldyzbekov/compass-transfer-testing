/**
 * Интерфейс PaymentNotificationData
 * Данные уведомления о платеже
 * @interface
 */
export interface PaymentNotificationData {
  /** Идентификатор платежа */
  paymentId?: string;
  /** Сумма платежа */
  amount?: number;
  /** Валюта */
  currency?: string;
  /** Метод платежа */
  paymentMethod?: string;
  /** Статус платежа */
  status?: string;
  /** Время платежа */
  timestamp?: string;
}
