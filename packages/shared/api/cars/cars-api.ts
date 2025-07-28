import type {
  CarColor,
  VehicleType,
  ServiceClass,
  VehicleStatus,
  CarFeature,
} from '@entities/cars/enums';
import type { GetCarDTOKeysetPaginationResult } from '@entities/cars/interface';
import { mockCarsResult } from '@entities/cars/mock-data/cars-mock';

/**
 * Параметры для получения автомобилей водителя
 */
export interface GetMyCarParams {
  // Пагинация
  First?: number;
  Before?: string;
  After?: string;
  Last?: number;
  Size?: number;

  // Фильтры
  Make?: string;
  Model?: string;
  Year?: number;
  Color?: CarColor;
  LicensePlate?: string;
  Type?: VehicleType;
  ServiceClass?: ServiceClass;
  Status?: VehicleStatus;
  PassengerCapacity?: number;
  Features?: CarFeature[];

  // Поиск
  'FTS.Plain'?: string;
  'FTS.Query'?: string;

  // Сортировка
  SortBy?: string;
  SortOrder?: 'asc' | 'desc';
}

/**
 * API для работы с автомобилями
 */
export const carsApi = {
  /**
   * Получить автомобили текущего водителя
   */
  async getMyCars(params?: GetMyCarParams): Promise<GetCarDTOKeysetPaginationResult> {
    // Используем mock данные пока нет доступа к API
    // const response = await apiClient.get<GetCarDTOKeysetPaginationResult>('/Car/my', {
    //   params,
    // });

    // Имитируем задержку сети
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Применяем фильтрацию к mock данным
    let filteredCars = [...mockCarsResult.data];

    if (params?.Make) {
      filteredCars = filteredCars.filter(car =>
        car.make.toLowerCase().includes(params.Make!.toLowerCase()),
      );
    }

    if (params?.Model) {
      filteredCars = filteredCars.filter(car =>
        car.model.toLowerCase().includes(params.Model!.toLowerCase()),
      );
    }

    if (params?.Status) {
      filteredCars = filteredCars.filter(car => car.status === params.Status);
    }

    if (params?.Color) {
      filteredCars = filteredCars.filter(car => car.color === params.Color);
    }

    if (params?.Type) {
      filteredCars = filteredCars.filter(car => car.type === params.Type);
    }

    if (params?.ServiceClass) {
      filteredCars = filteredCars.filter(car => car.serviceClass === params.ServiceClass);
    }

    if (params?.['FTS.Plain']) {
      const searchTerm = params['FTS.Plain'].toLowerCase();

      filteredCars = filteredCars.filter(
        car =>
          car.make.toLowerCase().includes(searchTerm) ||
          car.model.toLowerCase().includes(searchTerm) ||
          car.licensePlate.toLowerCase().includes(searchTerm),
      );
    }

    const pageSize = params?.Size || 10;
    const totalCount = filteredCars.length;

    return {
      data: filteredCars.slice(0, pageSize),
      totalCount,
      pageSize,
      hasPrevious: false,
      hasNext: totalCount > pageSize,
    };
  },
};
