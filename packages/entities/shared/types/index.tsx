export enum CarType {
  Sedan = 'Sedan',
  Hatchback = 'Hatchback',
  SUV = 'SUV',
  Minivan = 'Minivan',
  Coupe = 'Coupe',
  Cargo = 'Cargo',
  Pickup = 'Pickup',
}

/**
 * Массив всех значений CarType
 */
export const CarTypeValues: Record<CarType, string> = {
  [CarType.Sedan]: 'Седан',
  [CarType.Hatchback]: 'Хэтчбек',
  [CarType.SUV]: 'Внедорожник',
  [CarType.Minivan]: 'Минивэн',
  [CarType.Coupe]: 'Купе',
  [CarType.Cargo]: 'Грузовой',
  [CarType.Pickup]: 'Пикап',
};

// Маппинг вместимости по типам автомобилей
export const CAR_TYPE_CAPACITY: Record<CarType, number> = {
  [CarType.Sedan]: 4,
  [CarType.Hatchback]: 4,
  [CarType.SUV]: 5,
  [CarType.Minivan]: 8,
  [CarType.Coupe]: 2,
  [CarType.Cargo]: 2,
  [CarType.Pickup]: 3,
};

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