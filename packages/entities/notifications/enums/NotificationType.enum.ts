/**
 * Типы уведомлений в системе (соответствуют серверным значениям)
 */
export enum NotificationType {
  // Неизвестный тип
  Unknown = 'Unknown',

  // Уведомления о заказах
  OrderCreated = 'OrderCreated',
  OrderUpdated = 'OrderUpdated',
  OrderConfirmed = 'OrderConfirmed',
  OrderCancelled = 'OrderCancelled',
  OrderCompleted = 'OrderCompleted',

  // Уведомления о поездках
  RideRequest = 'RideRequest',
  RideAccepted = 'RideAccepted',
  RideRejected = 'RideRejected',
  RideStarted = 'RideStarted',
  RideCompleted = 'RideCompleted',
  RideCancelled = 'RideCancelled',
  RideUpdate = 'RideUpdate',

  // Уведомления о платежах
  Payment = 'Payment',
  PaymentReceived = 'PaymentReceived',
  PaymentFailed = 'PaymentFailed',
  PaymentRefunded = 'PaymentRefunded',

  // Уведомления о водителях
  DriverHeading = 'DriverHeading',
  DriverArrived = 'DriverArrived',
  DriverAssigned = 'DriverAssigned',
  DriverCancelled = 'DriverCancelled',
  DriverNearby = 'DriverNearby',

  // Системные уведомления
  System = 'System',
  SystemMessage = 'SystemMessage',
  Maintenance = 'Maintenance',

  // Промо уведомления
  Promo = 'Promo',
  PromoOffer = 'PromoOffer',

  // Верификация
  Verification = 'Verification',

  // Чат
  Chat = 'Chat',
}

/**
 * Массив всех значений типов уведомлений
 */
export const NotificationTypeValues = Object.values(NotificationType);

/**
 * Человекочитаемые названия типов уведомлений
 */
export const NotificationTypeLabels: Record<NotificationType, string> = {
  // Неизвестный тип
  [NotificationType.Unknown]: 'Неизвестный',

  // Уведомления о заказах
  [NotificationType.OrderCreated]: 'Заказ создан',
  [NotificationType.OrderUpdated]: 'Заказ обновлен',
  [NotificationType.OrderConfirmed]: 'Заказ подтвержден',
  [NotificationType.OrderCancelled]: 'Заказ отменен',
  [NotificationType.OrderCompleted]: 'Заказ завершен',

  // Уведомления о поездках
  [NotificationType.RideRequest]: 'Запрос поездки',
  [NotificationType.RideAccepted]: 'Поездка принята',
  [NotificationType.RideRejected]: 'Поездка отклонена',
  [NotificationType.RideStarted]: 'Поездка начата',
  [NotificationType.RideCompleted]: 'Поездка завершена',
  [NotificationType.RideCancelled]: 'Поездка отменена',
  [NotificationType.RideUpdate]: 'Обновление поездки',

  // Уведомления о платежах
  [NotificationType.Payment]: 'Платеж',
  [NotificationType.PaymentReceived]: 'Платеж получен',
  [NotificationType.PaymentFailed]: 'Платеж не прошел',
  [NotificationType.PaymentRefunded]: 'Платеж возвращен',

  // Уведомления о водителях
  [NotificationType.DriverHeading]: 'Водитель в пути',
  [NotificationType.DriverArrived]: 'Водитель прибыл',
  [NotificationType.DriverAssigned]: 'Водитель назначен',
  [NotificationType.DriverCancelled]: 'Водитель отменил',
  [NotificationType.DriverNearby]: 'Водитель рядом',

  // Системные уведомления
  [NotificationType.System]: 'Системное',
  [NotificationType.SystemMessage]: 'Системное сообщение',
  [NotificationType.Maintenance]: 'Техническое обслуживание',

  // Промо уведомления
  [NotificationType.Promo]: 'Промо',
  [NotificationType.PromoOffer]: 'Промо предложение',

  // Верификация
  [NotificationType.Verification]: 'Верификация',

  // Чат
  [NotificationType.Chat]: 'Чат',
};

/**
 * Проверка, является ли значение валидным типом уведомления
 */
export const isValidNotificationType = (value: string): value is NotificationType => {
  return NotificationTypeValues.includes(value as NotificationType);
};
