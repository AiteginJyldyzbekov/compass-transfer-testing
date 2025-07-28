/**
 * `Unknown` = Неизвестный<br>`Instant` = Мгновенный заказ от клиента<br>`Scheduled` = Запланированный заказ<br>`Partner` = Заказ от партнера<br>`Shuttle` = Заезд по маршруту<br>`Subscription` = Подписка на регулярные поездки
 * @enum
 */
export enum OrderType {
  Unknown = 'Unknown',
  Instant = 'Instant',
  Scheduled = 'Scheduled',
  Partner = 'Partner',
  Shuttle = 'Shuttle',
  Subscription = 'Subscription',
}
/**
 * Массив всех значений OrderType
 */
export const OrderTypeValues = [
  OrderType.Unknown,
  OrderType.Instant,
  OrderType.Scheduled,
  OrderType.Partner,
  OrderType.Shuttle,
  OrderType.Subscription,
];
