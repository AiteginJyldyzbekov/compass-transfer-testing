import { 
  CarColor, 
  VehicleType, 
  ServiceClass, 
  VehicleStatus, 
  CarFeature 
} from '@entities/cars/enums';
import type { GetCarDTO, GetCarDTOKeysetPaginationResult } from '@entities/cars/interface';

/**
 * Mock данные автомобилей для тестирования
 */
export const mockCars: GetCarDTO[] = [
  {
    id: 'car-001',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    color: CarColor.White,
    licensePlate: '01KG123ABC',
    type: VehicleType.Sedan,
    serviceClass: ServiceClass.Comfort,
    status: VehicleStatus.Available,
    passengerCapacity: 4,
    features: [
      CarFeature.AirConditioning,
      CarFeature.Bluetooth,
      CarFeature.Navigation,
      CarFeature.BackupCamera,
    ],
    drivers: ['driver-001', 'driver-002'],
  },
  {
    id: 'car-002',
    make: 'Hyundai',
    model: 'Tucson',
    year: 2021,
    color: CarColor.Black,
    licensePlate: '01KG456DEF',
    type: VehicleType.SUV,
    serviceClass: ServiceClass.ComfortPlus,
    status: VehicleStatus.Available,
    passengerCapacity: 5,
    features: [
      CarFeature.AirConditioning,
      CarFeature.ClimateControl,
      CarFeature.LeatherSeats,
      CarFeature.HeatedSeats,
      CarFeature.Navigation,
      CarFeature.ParkingSensors,
    ],
    drivers: ['driver-001'],
  },
  {
    id: 'car-003',
    make: 'Volkswagen',
    model: 'Polo',
    year: 2020,
    color: CarColor.Silver,
    licensePlate: '01KG789GHI',
    type: VehicleType.Hatchback,
    serviceClass: ServiceClass.Economy,
    status: VehicleStatus.Maintenance,
    passengerCapacity: 4,
    features: [
      CarFeature.AirConditioning,
      CarFeature.Bluetooth,
      CarFeature.USBPort,
    ],
    drivers: ['driver-001'],
  },
  {
    id: 'car-004',
    make: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2023,
    color: CarColor.Gray,
    licensePlate: '01KG012JKL',
    type: VehicleType.Sedan,
    serviceClass: ServiceClass.Business,
    status: VehicleStatus.Available,
    passengerCapacity: 4,
    features: [
      CarFeature.ClimateControl,
      CarFeature.LeatherSeats,
      CarFeature.HeatedSeats,
      CarFeature.Navigation,
      CarFeature.BackupCamera,
      CarFeature.ParkingSensors,
      CarFeature.PremiumAudio,
      CarFeature.Sunroof,
    ],
    drivers: ['driver-001'],
  },
  {
    id: 'car-005',
    make: 'Ford',
    model: 'Transit',
    year: 2019,
    color: CarColor.Blue,
    licensePlate: '01KG345MNO',
    type: VehicleType.Minivan,
    serviceClass: ServiceClass.Economy,
    status: VehicleStatus.Repair,
    passengerCapacity: 8,
    features: [
      CarFeature.AirConditioning,
      CarFeature.ThirdRowSeats,
      CarFeature.LuggageCarrier,
    ],
    drivers: ['driver-001'],
  },
];

/**
 * Mock результат с пагинацией
 */
export const mockCarsResult: GetCarDTOKeysetPaginationResult = {
  data: mockCars,
  totalCount: mockCars.length,
  pageSize: 10,
  hasPrevious: false,
  hasNext: false,
};
