import type {
  PaginatedRidesResponse,
  GetRideDTO,
  ScheduledRidesResponse,
  ScheduledRidesParams
} from '@entities/rides/interface';
import apiClient from '../client';

/**
 * Параметры для получения поездок пользователя
 */
export interface GetMyRidesParams {
  // Пагинация
  First?: number;
  Before?: string;
  After?: string;
  Last?: number;
  Size?: number;

  // Фильтры
  Status?: string;
  DriverId?: string;
  OrderId?: string;

  // Поиск
  'FTS.Plain'?: string;
  'FTS.Query'?: string;

  // Сортировка
  SortBy?: string;
  SortOrder?: 'asc' | 'desc';
}

/**
 * API для работы с поездками
 */
export const ridesApi = {
  /**
   * Получить поездки текущего пользователя
   */
  async getMyRides(params?: GetMyRidesParams): Promise<PaginatedRidesResponse> {
    const result = await apiClient.get<PaginatedRidesResponse>('/Ride/my', {
      params,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    if (!result.data) {
      throw new Error('Нет данных в ответе API');
    }

    return result.data;
  },

  /**
   * Получить конкретную поездку по ID
   */
  async getRide(rideId: string): Promise<GetRideDTO> {
    const result = await apiClient.get<GetRideDTO>(`/Ride/${rideId}`);

    if (result.error) {
      throw new Error(result.error.message);
    }

    if (!result.data) {
      throw new Error('Нет данных в ответе API');
    }

    return result.data;
  },

  /**
   * Получить поездки конкретного пользователя
   */
  async getUserRides(userId: string, params?: GetMyRidesParams): Promise<PaginatedRidesResponse> {
    // Используем общий эндпоинт /Ride с фильтрацией по DriverId
    const result = await apiClient.get<PaginatedRidesResponse>('/Ride', {
      params: {
        ...params,
        DriverId: userId, // Фильтруем по водителю
      },
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    if (!result.data) {
      throw new Error('Нет данных в ответе API');
    }

    return result.data;
  },

  /**
   * Получить запланированные поездки для водителя
   */
  async getMyAssignedRides(params?: ScheduledRidesParams): Promise<ScheduledRidesResponse> {
    // Используем mock данные пока нет доступа к API
    // const response = await apiClient.get<ScheduledRidesResponse>('/Ride/my/assigned', {
    //   params,
    // });
    
    // Имитируем задержку сети
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock данные будут добавлены позже
    return {
      data: [],
      totalCount: 0,
      pageSize: params?.size || 10,
      hasPrevious: false,
      hasNext: false,
    };
  },
};
