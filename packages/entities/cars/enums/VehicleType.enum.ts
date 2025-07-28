/**
 * Тип транспортного средства (тип кузова)
 * `Sedan` = Седан<br>`Hatchback` = Хэтчбек<br>`SUV` = Внедорожник<br>`Minivan` = Минивэн<br>`Coupe` = Купе<br>`Cargo` = Грузовой<br>`Pickup` = Пикап
 * @enum
 */
export enum VehicleType {
  Sedan = 'Sedan',
  Hatchback = 'Hatchback',
  SUV = 'SUV',
  Minivan = 'Minivan',
  Coupe = 'Coupe',
  Cargo = 'Cargo',
  Pickup = 'Pickup'
}
/**
 * Массив всех значений VehicleType
 */
export const VehicleTypeValues = [
  VehicleType.Sedan,
  VehicleType.Hatchback,
  VehicleType.SUV,
  VehicleType.Minivan,
  VehicleType.Coupe,
  VehicleType.Cargo,
  VehicleType.Pickup
];
