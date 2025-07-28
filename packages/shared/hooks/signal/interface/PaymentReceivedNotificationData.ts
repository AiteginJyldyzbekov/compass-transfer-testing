/**
 * Интерфейс PaymentReceivedNotificationData
 * Данные уведомления о получении платежа (согласно API документации)
 * @interface
 */
export interface PaymentReceivedNotificationData {
  /** Внутренний ID платежа */
  paymentId: string;
  /** Внешний ID платежа (transactionId от OptimaBank) */
  transactionId: string;
}
