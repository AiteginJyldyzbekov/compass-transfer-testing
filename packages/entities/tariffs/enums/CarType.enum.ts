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