/**
 * Интерфейс PaymentFailedNotificationData
 * Данные уведомления о неудачном платеже
 * @interface
 */
export interface PaymentFailedNotificationData {
  /** Идентификатор платежа */
  paymentId?: string;
  /** Сумма платежа */
  amount?: number;
  /** Валюта */
  currency?: string;
  /** Причина неудачи */
  failureReason?: string;
  /** Код ошибки */
  errorCode?: string;
  /** Время неудачи */
  failedAt?: string;
}
