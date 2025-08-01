import { apiClient } from '@shared/api';
import type { VehicleType } from '@entities/cars/enums/VehicleType.enum';
import type { CarType, ServiceClass } from '@entities/tariff/enums';

/**
 * Интерфейс для активного водителя с геолокацией
 */
export interface ActiveDriverDTO {
  id: string;
  type: VehicleType;
  serviceClass: ServiceClass;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Параметры для поиска активных водителей в зоне
 */
export interface GetActiveDriversParams {
  latFrom: number;
  latTo: number;
  longFrom: number;
  longTo: number;
  carType?: CarType; // Фильтр по типу автомобиля
  serviceClass?: ServiceClass; // Фильтр по классу обслуживания
}

/**
 * Получает список активных водителей в указанной прямоугольной зоне
 * @param params - Параметры зоны поиска
 * @returns Список активных водителей с их местоположением
 */
export const getActiveDrivers = async (
  params: GetActiveDriversParams,
): Promise<ActiveDriverDTO[]> => {
  try {
    const queryParams: any = {
      LatFrom: params.latFrom,
      LatTo: params.latTo,
      LongFrom: params.longFrom,
      LongTo: params.longTo,
    };

    // Добавляем фильтр по типу автомобиля если указан
    if (params.carType) {
      queryParams.CarType = params.carType;
    }

    // Добавляем фильтр по классу обслуживания если указан
    if (params.serviceClass) {
      queryParams.ServiceClass = params.serviceClass;
    }

    const response = await apiClient.get('/GIS/ActiveDrivers', {
      params: queryParams,
    });

    // Проверяем что response.data это массив
    const drivers = Array.isArray(response.data) ? response.data : [];

    return drivers;
  } catch (error) {
    throw error;
  }
};
