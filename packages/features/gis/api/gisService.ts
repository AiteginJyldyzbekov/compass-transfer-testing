import { BaseApiService } from '@shared/api';
import type { ActiveDriverDTO, GetActiveDriversParams } from '@features/gis/api/gisApi';

/**
 * Service for GIS-related endpoints (e.g., active drivers search)
 */
class GisService extends BaseApiService {
  protected baseUrl = '/GIS';

  /**
   * Search active drivers inside rectangular bounds
   */
  async getActiveDrivers(params: GetActiveDriversParams): Promise<ActiveDriverDTO[]> {
    interface ActiveDriversQueryParams {
      LatFrom: number;
      LatTo: number;
      LongFrom: number;
      LongTo: number;
      CarType?: string;
      ServiceClass?: string;
    }
    
    const queryParams: ActiveDriversQueryParams = {
      LatFrom: params.latFrom,
      LatTo: params.latTo,
      LongFrom: params.longFrom,
      LongTo: params.longTo,
    };

    // Добавляем фильтр по типу автомобиля если указан
    if (params.carType) {
      queryParams.CarType = params.carType;
    }

    const result = await this.get<ActiveDriverDTO[]>('ActiveDrivers', {
      params: queryParams,
    });

    return this.handleApiResult(result);
  }
}

// Singleton instance so hooks/components can import a ready-to-use service
export const gisService = new GisService();
