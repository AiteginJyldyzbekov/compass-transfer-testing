import type {
  CarColor,
  VehicleType,
  ServiceClass,
  VehicleStatus,
  CarFeature,
} from '@entities/cars/enums';

/**
 * Интерфейс для связи водителя с автомобилем
 */
export interface CarDriverRelation {
  driverId: string;
  isActive: boolean;
  assignedAt: string;
}

/**
 * Интерфейс для получения полной информации об автомобиле с ID и водителями
 * @interface GetCarDTO
 */
export interface GetCarDTO {
  make: string;
  model: string;
  year: number;
  color: CarColor;
  licensePlate: string;
  type: VehicleType;
  serviceClass: ServiceClass;
  status: VehicleStatus;
  passengerCapacity: number;
  features: CarFeature[];
  id: string;
  drivers?: Array<CarDriverRelation>;
}
