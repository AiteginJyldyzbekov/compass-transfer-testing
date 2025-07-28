/**
 * `Economy` = эконом-класс<br>`Comfort` = комфорт-класс<br>`ComfortPlus` = комфорт+<br>`Business` = бизнес-класс<br>`Premium` = премиум-класс<br>`Vip` = vip-класс<br>`Luxury` = люкс-класс
 * @enum
 */
export enum ServiceClass {
  Economy = 'Economy',
  Comfort = 'Comfort',
  ComfortPlus = 'ComfortPlus',
  Business = 'Business',
  Premium = 'Premium',
  Vip = 'Vip',
  Luxury = 'Luxury',
}
/**
 * Массив всех значений ServiceClass
 */
export const ServiceClassValues = [
  ServiceClass.Economy,
  ServiceClass.Comfort,
  ServiceClass.ComfortPlus,
  ServiceClass.Business,
  ServiceClass.Premium,
  ServiceClass.Vip,
  ServiceClass.Luxury,
];