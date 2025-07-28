import type {
  PartnerRouteDTO,
  UpdatePartnerRouteDTO,
} from '@entities/routes/interface/PartnerRouteDTO';
import { apiGet, apiPost, apiPut } from './client';

/**
 * API для работы с маршрутами
 */
export const routesApi = {
  /**
   * Обновление маршрута партнера
   * PUT /Route/Partner/self
   */
  updatePartnerRoute: async (
    routeId: string,
    data: UpdatePartnerRouteDTO,
  ): Promise<PartnerRouteDTO> => {
    const result = await apiPut<PartnerRouteDTO>(`/Route/Partner/self`, {
      routeId,
      price: data.price,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  /**
   * Получение маршрутов партнера
   * GET /Route/Partner/{partner_id}
   */
  getPartnerRoutes: async (partnerId: string): Promise<PartnerRouteDTO[]> => {
    const result = await apiGet<PartnerRouteDTO[]>(`/Route/Partner/${partnerId}`);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  /**
   * Создание нового маршрута партнера
   * POST /Route/Partner/self
   */
  createPartnerRoute: async (data: {
    startLocationId: string;
    endLocationId: string;
    price: number;
  }): Promise<PartnerRouteDTO> => {
    const result = await apiPost<PartnerRouteDTO>('/Route/Partner/self', data);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },
};
