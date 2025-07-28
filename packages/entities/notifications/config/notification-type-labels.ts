import type { NotificationType } from '../enums/NotificationType.enum';

/**
 * Переводы для типов уведомлений
 */
export const NotificationTypeLabels: Record<NotificationType, string> = {
  Unknown: 'Неизвестный тип',

  // Уведомления о заказах
  OrderCreated: 'Заказ создан',
  OrderUpdated: 'Заказ обновлен',
  OrderConfirmed: 'Заказ подтвержден',
  OrderCancelled: 'Заказ отменен',
  OrderCompleted: 'Заказ завершен',

  // Уведомления о поездках
  RideRequest: 'Запрос поездки',
  RideAccepted: 'Поездка принята',
  RideRejected: 'Поездка отклонена',
  RideStarted: 'Поездка начата',
  RideCompleted: 'Поездка завершена',
  RideCancelled: 'Поездка отменена',
  RideUpdate: 'Обновление поездки',

  // Уведомления о платежах
  Payment: 'Платеж',
  PaymentReceived: 'Платеж получен',
  PaymentFailed: 'Ошибка платежа',
  PaymentRefunded: 'Платеж возвращен',

  // Уведомления о водителях
  DriverHeading: 'Водитель в пути',
  DriverArrived: 'Водитель прибыл',
  DriverAssigned: 'Водитель назначен',
  DriverCancelled: 'Водитель отменил',
  DriverNearby: 'Водитель рядом',

  // Системные уведомления
  System: 'Системное',
  SystemMessage: 'Системное сообщение',
  Maintenance: 'Техническое обслуживание',

  // Промо уведомления
  Promo: 'Акция',
  PromoOffer: 'Промо предложение',

  // Верификация
  Verification: 'Верификация',

  // Чат
  Chat: 'Сообщение в чате',
};

/**
 * Получить перевод для типа уведомления
 */
export const getNotificationTypeLabel = (type: NotificationType): string => {
  return NotificationTypeLabels[type] || 'Неизвестный тип';
};

/**
 * Цвета для типов уведомлений (для Badge компонента)
 */
export const NotificationTypeColors: Record<NotificationType, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Unknown: 'outline',

  // Уведомления о заказах
  OrderCreated: 'default',
  OrderUpdated: 'secondary',
  OrderConfirmed: 'default',
  OrderCancelled: 'destructive',
  OrderCompleted: 'default',

  // Уведомления о поездках
  RideRequest: 'outline',
  RideAccepted: 'default',
  RideRejected: 'destructive',
  RideStarted: 'default',
  RideCompleted: 'default',
  RideCancelled: 'destructive',
  RideUpdate: 'secondary',

  // Уведомления о платежах
  Payment: 'outline',
  PaymentReceived: 'default',
  PaymentFailed: 'destructive',
  PaymentRefunded: 'secondary',

  // Уведомления о водителях
  DriverHeading: 'secondary',
  DriverArrived: 'default',
  DriverAssigned: 'default',
  DriverCancelled: 'destructive',
  DriverNearby: 'secondary',

  // Системные уведомления
  System: 'secondary',
  SystemMessage: 'secondary',
  Maintenance: 'secondary',

  // Промо уведомления
  Promo: 'default',
  PromoOffer: 'default',

  // Верификация
  Verification: 'outline',

  // Чат
  Chat: 'default',
};

/**
 * Получить цвет для типа уведомления
 */
export const getNotificationTypeColor = (type: NotificationType) => {
  return NotificationTypeColors[type] || 'outline';
};
