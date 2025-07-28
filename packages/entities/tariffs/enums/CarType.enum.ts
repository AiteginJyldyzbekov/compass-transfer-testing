/**
 * `Sedan` = седан<br>`Hatchback` = хэтчбек<br>`SUV` = внедорожник<br>`Minivan` = минивэн<br>`Coupe` = купе<br>`Cargo` = грузовой<br>`Pickup` = пикап
 * @enum
 */
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
export const CarTypeValues = [
  CarType.Sedan,
  CarType.Hatchback,
  CarType.SUV,
  CarType.Minivan,
  CarType.Coupe,
  CarType.Cargo,
  CarType.Pickup,
];
