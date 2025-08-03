import { OrderType } from '../enums/OrderType.enum';

/**
 * Получить маршрут для создания заказа по типу
 */
export function getOrderCreateRoute(orderType: OrderType): string {
  switch (orderType) {
    case OrderType.Instant:
      return '/orders/create/instant';
    case OrderType.Scheduled:
      return '/orders/create/scheduled';
    case OrderType.Partner:
      return '/orders/create/partner';
    case OrderType.Shuttle:
      return '/orders/create/shuttle';
    case OrderType.Subscription:
      return '/orders/create/subscription';
    case OrderType.Unknown:
    default:
      return '/orders/create/instant'; // Fallback на мгновенный заказ
  }
}

/**
 * Получить маршрут для редактирования заказа по типу
 */
export function getOrderEditRoute(orderId: string, orderType: OrderType): string {
  switch (orderType) {
    case OrderType.Instant:
      return `/orders/edit/instant/${orderId}`;
    case OrderType.Scheduled:
      return `/orders/edit/scheduled/${orderId}`;
    case OrderType.Partner:
      return `/orders/edit/partner/${orderId}`;
    case OrderType.Shuttle:
      return `/orders/edit/shuttle/${orderId}`;
    case OrderType.Subscription:
      return `/orders/edit/subscription/${orderId}`;
    case OrderType.Unknown:
    default:
      return `/orders/edit/instant/${orderId}`; // Fallback на мгновенный заказ
  }
}

/**
 * Получить маршрут для просмотра заказа по типу
 */
export function getOrderViewRoute(orderId: string, orderType: OrderType): string {
  switch (orderType) {
    case OrderType.Instant:
      return `/orders/instant/${orderId}`;
    case OrderType.Scheduled:
      return `/orders/scheduled/${orderId}`;
    case OrderType.Partner:
      return `/orders/partner/${orderId}`;
    case OrderType.Shuttle:
      return `/orders/shuttle/${orderId}`;
    case OrderType.Subscription:
      return `/orders/subscription/${orderId}`;
    case OrderType.Unknown:
    default:
      return `/orders/instant/${orderId}`; // Fallback на мгновенный заказ
  }
}

/**
 * Получить маршрут для просмотра заказа (legacy, без типа)
 */
export function getOrderViewRouteLegacy(orderId: string): string {
  return `/orders/${orderId}`;
}
