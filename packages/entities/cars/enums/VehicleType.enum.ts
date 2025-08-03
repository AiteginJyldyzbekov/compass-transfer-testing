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

/**
 * Маппинг пассажировместимости по типам автомобилей
 */
export const VEHICLE_TYPE_CAPACITY: Record<VehicleType, number> = {
  [VehicleType.Sedan]: 4,
  [VehicleType.Hatchback]: 4,
  [VehicleType.SUV]: 5,
  [VehicleType.Minivan]: 8,
  [VehicleType.Coupe]: 2,
  [VehicleType.Cargo]: 2,
  [VehicleType.Pickup]: 3,
};
