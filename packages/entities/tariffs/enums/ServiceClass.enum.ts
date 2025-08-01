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
 * Переводы значений ServiceClass на русский язык
 */
export const ServiceClassValues: Record<ServiceClass, string> = {
  [ServiceClass.Economy]: 'Эконом',
  [ServiceClass.Comfort]: 'Комфорт',
  [ServiceClass.ComfortPlus]: 'Комфорт+',
  [ServiceClass.Business]: 'Бизнес',
  [ServiceClass.Premium]: 'Премиум',
  [ServiceClass.Vip]: 'VIP',
  [ServiceClass.Luxury]: 'Люкс',
};

/**
 * Цвета для каждого класса обслуживания
 */
export const ServiceClassColors: Record<ServiceClass, string> = {
  [ServiceClass.Economy]: 'bg-green-500 text-white',
  [ServiceClass.Comfort]: 'bg-blue-500 text-white',
  [ServiceClass.ComfortPlus]: 'bg-cyan-500 text-white',
  [ServiceClass.Business]: 'bg-purple-500 text-white',
  [ServiceClass.Premium]: 'bg-yellow-500 text-white',
  [ServiceClass.Vip]: 'bg-pink-500 text-white',
  [ServiceClass.Luxury]: 'bg-amber-500 text-white',
};