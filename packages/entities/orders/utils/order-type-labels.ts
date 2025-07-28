import type { OrderType } from '@shared/api/notifications';

/**
 * Переводы для типов заказов
 */
export const OrderTypeLabels: Record<OrderType, string> = {
  Unknown: 'Неизвестно',
  Instant: 'Мгновенный',
  Scheduled: 'Запланированный',
  Partner: 'Партнерский',
  Shuttle: 'Шаттл',
  Subscription: 'Подписка',
};

/**
 * Получить перевод для типа заказа
 */
export const getOrderTypeLabel = (type: OrderType): string => {
  return OrderTypeLabels[type] || 'Неизвестно';
};
