import type {
  CarColor,
  VehicleType,
  ServiceClass,
  VehicleStatus,
  CarFeature,
} from '@entities/cars/enums';

/**
 * Базовый интерфейс для автомобиля с основными характеристиками
 * @interface CarBaseDTO
 */
export interface CarBaseDTO {
  make: string;
  model: string;
  year: number;
  color: CarColor;
  licensePlate: string;
  type: VehicleType;
  serviceClass: ServiceClass;
  status: VehicleStatus;
  passengerCapacity: number;
  features: CarFeature;
}
