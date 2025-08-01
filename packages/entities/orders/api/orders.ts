import { apiGet, apiPost, apiPut, apiDelete } from '@shared/api/client';
import type { GetRideDTO } from '@entities/rides/interface/GetRideDTO';
import type {
  CreateScheduledOrderDTO,
  CreateScheduledRideDTO,
  GetOrderDTO
} from '../interface';

/**
 * Расширенный интерфейс для создания запланированного заказа
 * Включает дополнительные поля из API
 */
export interface CreateScheduledOrderRequest extends CreateScheduledOrderDTO {
  /** Описание заказа */
  description?: string | null;
  
  /** Номер рейса */
  airFlight?: string | null;
  
  /** Номер FlyReis */
  flyReis?: string | null;
  
  /** Комментарии к заказу */
  notes?: string | null;
}

/**
 * API для работы с заказами
 */
export class OrdersApi {
  /**
   * Создание запланированного заказа
   * POST /Order/scheduled
   */
  static async createScheduledOrder(data: CreateScheduledOrderRequest): Promise<GetOrderDTO> {
    const response = await apiPost<GetOrderDTO>('/Order/scheduled', data);

    if (response.error) {
      throw new Error(response.error.message || 'Failed to create scheduled order');
    }

    if (!response.data) {
      throw new Error('No data received from server');
    }

    return response.data;
  }

  /**
   * Назначение водителя и создание поездки для запланированного заказа
   * POST /Order/scheduled/{uuid}/ride
   */
  static async createScheduledRide(
    orderId: string,
    data: CreateScheduledRideDTO
  ): Promise<GetRideDTO> {
    const response = await apiPost<GetRideDTO>(
      `/Order/scheduled/${orderId}/ride`,
      data
    );

    if (response.error) {
      throw new Error(response.error.message || 'Failed to create scheduled ride');
    }

    if (!response.data) {
      throw new Error('No data received from server');
    }

    return response.data;
  }

  /**
   * Получение заказа по ID
   * GET /Order/{id}
   */
  static async getOrder(id: string): Promise<GetOrderDTO> {
    const response = await apiGet<GetOrderDTO>(`/Order/${id}`);

    if (response.error) {
      throw new Error(response.error.message || 'Failed to get order');
    }

    if (!response.data) {
      throw new Error('No data received from server');
    }

    return response.data;
  }

  /**
   * Получение запланированного заказа по ID
   * GET /Order/scheduled/{id}
   */
  static async getScheduledOrder(id: string): Promise<GetOrderDTO> {
    const response = await apiGet<GetOrderDTO>(`/Order/scheduled/${id}`);

    if (response.error) {
      throw new Error(response.error.message || 'Failed to get scheduled order');
    }

    if (!response.data) {
      throw new Error('No data received from server');
    }

    return response.data;
  }

  /**
   * Обновление запланированного заказа
   * PUT /Order/scheduled/{id}
   */
  static async updateScheduledOrder(
    id: string,
    data: Partial<CreateScheduledOrderRequest>
  ): Promise<GetOrderDTO> {
    const response = await apiPut<GetOrderDTO>(`/Order/scheduled/${id}`, data);

    if (response.error) {
      throw new Error(response.error.message || 'Failed to update scheduled order');
    }

    if (!response.data) {
      throw new Error('No data received from server');
    }

    return response.data;
  }

  /**
   * Отмена заказа
   * DELETE /Order/{id}
   */
  static async cancelOrder(id: string): Promise<void> {
    const response = await apiDelete(`/Order/${id}`);

    if (response.error) {
      throw new Error(response.error.message || 'Failed to cancel order');
    }
  }
}

export default OrdersApi;
