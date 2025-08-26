import type {
  GetOrderDTOKeysetPaginationResult,
  GetOrderDTO,
  OrderStatsDTO
} from '@entities/orders/interface';
import apiClient from '../client';

/**
 * Параметры для получения заказов пользователя
 */
export interface GetMyOrdersParams {
  // Пагинация
  First?: number;
  Before?: string;
  After?: string;
  Last?: number;
  Size?: number;

  // Фильтры
  Status?: string;
  Type?: string;
  CreatedAt?: string;
  CompletedAt?: string;

  // Поиск
  'FTS.Plain'?: string;
  'FTS.Query'?: string;

  // Сортировка
  SortBy?: string;
  SortOrder?: 'asc' | 'desc';
}

/**
 * API для работы с заказами
 */
export const ordersApi = {
  /**
   * Получить заказы текущего пользователя
   */
  async getMyOrders(params?: GetMyOrdersParams): Promise<GetOrderDTOKeysetPaginationResult> {
    const result = await apiClient.get<GetOrderDTOKeysetPaginationResult>('/Order/my/participant', {
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
   * Получить статистику заказов текущего пользователя
   */
  async getMyOrdersStats(): Promise<OrderStatsDTO> {
    const result = await apiClient.get<OrderStatsDTO>('/Order/my/participant/stats');

    if (result.error) {
      throw new Error(result.error.message);
    }

    if (!result.data) {
      throw new Error('Нет данных в ответе API');
    }

    return result.data;
  },

  /**
   * Получить конкретный заказ по ID
   */
  async getOrder(orderId: string): Promise<GetOrderDTO> {
    const result = await apiClient.get<GetOrderDTO>(`/Order/my/participant/${orderId}`);

    if (result.error) {
      throw new Error(result.error.message);
    }

    if (!result.data) {
      throw new Error('Нет данных в ответе API');
    }

    return result.data;
  },

  /**
   * Получить заказы конкретного пользователя
   */
  async getUserOrders(userId: string, params?: GetMyOrdersParams): Promise<GetOrderDTOKeysetPaginationResult> {
    // Используем общий эндпоинт /Order с фильтрацией по CreatorId
    const result = await apiClient.get<GetOrderDTOKeysetPaginationResult>('/Order', {
      params: {
        ...params,
        CreatorId: userId, // Фильтруем по создателю заказа
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
   * Получить статистику заказов конкретного пользователя
   */
  async getUserOrdersStats(userId: string): Promise<OrderStatsDTO> {
    const result = await apiClient.get<OrderStatsDTO>(`/User/${userId}/orders/stats`);

    if (result.error) {
      throw new Error(result.error.message);
    }

    if (!result.data) {
      throw new Error('Нет данных в ответе API');
    }

    return result.data;
  },
};
