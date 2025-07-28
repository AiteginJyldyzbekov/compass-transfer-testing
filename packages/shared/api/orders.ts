import type { OrderStatus } from '@entities/orders/enums/OrderStatus.enum';
import type { OrderSubStatus } from '@entities/orders/enums/OrderSubStatus.enum';
import type { OrderType } from '@entities/orders/enums/OrderType.enum';
import type { GetOrderDTO } from '@entities/orders/interface/GetOrderDTO';
import { apiGet, apiDelete } from './client';

export interface OrderFilters {
  first?: boolean;
  before?: string;
  after?: string;
  last?: boolean;
  size?: number;
  orderNumber?: string;
  orderNumberOp?: 'GreaterThan' | 'GreaterThanOrEqual' | 'Equal' | 'LessThanOrEqual' | 'LessThan';
  type?: OrderType[];
  status?: OrderStatus[];
  subStatus?: OrderSubStatus[];
  creatorId?: string;
  createdAt?: string;
  createdAtOp?: 'GreaterThan' | 'GreaterThanOrEqual' | 'Equal' | 'LessThanOrEqual' | 'LessThan';
  completedAt?: string;
  completedAtOp?: 'GreaterThan' | 'GreaterThanOrEqual' | 'Equal' | 'LessThanOrEqual' | 'LessThan';
  scheduledTime?: string;
  scheduledTimeOp?: 'GreaterThan' | 'GreaterThanOrEqual' | 'Equal' | 'LessThanOrEqual' | 'LessThan';
  services?: string[];
  customerId?: string;
  airFlight?: string;
  airFlightOp?: 'Equals' | 'NotEquals' | 'Contains' | 'NotContains' | 'StartsWith' | 'EndsWith' | 'IsEmpty' | 'IsNotEmpty';
  flyReis?: string;
  flyReisOp?: 'Equals' | 'NotEquals' | 'Contains' | 'NotContains' | 'StartsWith' | 'EndsWith' | 'IsEmpty' | 'IsNotEmpty';
  sortBy?: string;
  sortOrder?: 'Asc' | 'Desc';
}

export interface OrderApiResponse {
  data: GetOrderDTO[];
  totalCount: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface OrderStatsResponse {
  pending: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  expired: number;
}

export const ordersApi = {
  // Получение списка заказов
  getOrders: async (filters: OrderFilters = {}): Promise<OrderApiResponse> => {
    const result = await apiGet<OrderApiResponse>('/Order', { params: filters });

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Получение статистики заказов
  getOrderStats: async (): Promise<OrderStatsResponse> => {
    const result = await apiGet<OrderStatsResponse>('/Order/stats');

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Удаление заказа
  deleteOrder: async (orderId: string): Promise<void> => {
    const result = await apiDelete(`/Order/${orderId}`);

    if (result.error) {
      throw new Error(result.error.message);
    }
  },
};

// Сервис для работы с заказами (для новых хуков)
export const orderService = {
  // Получение мгновенного заказа
  getInstantOrder: async (id: string): Promise<GetOrderDTO> => {
    const result = await apiGet<GetOrderDTO>(`/Order/instant/${id}`);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Получение запланированного заказа
  getScheduledOrder: async (id: string): Promise<GetOrderDTO> => {
    const result = await apiGet<GetOrderDTO>(`/Order/scheduled/${id}`);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Создание мгновенного заказа
  createInstantOrder: async (data: unknown): Promise<{ id: string }> => {
    const result = await apiPost<{ id: string }>('/Order/instant', data);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Обновление мгновенного заказа
  updateInstantOrder: async (id: string, data: unknown): Promise<{ id: string }> => {
    const result = await apiPut<{ id: string }>(`/Order/instant/${id}`, data);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Создание запланированного заказа
  createScheduledOrder: async (data: unknown): Promise<{ id: string }> => {
    const result = await apiPost<{ id: string }>('/Order/scheduled', data);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Обновление запланированного заказа
  updateScheduledOrder: async (id: string, data: unknown): Promise<{ id: string }> => {
    const result = await apiPut<{ id: string }>(`/Order/scheduled/${id}`, data);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Получение потенциальных водителей для заказа
  getPotentialDrivers: async (orderId: string): Promise<unknown[]> => {
    const result = await apiGet<unknown[]>(`/Order/${orderId}/potential-drivers`);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Создание мгновенного заказа через терминал
  createInstantOrderByTerminal: async (data: unknown): Promise<{ id: string }> => {
    const result = await apiPost<{ id: string }>('/Order/instant/terminal', data);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },

  // Создание поездки для запланированного заказа
  createScheduledRide: async (orderId: string, data: unknown): Promise<{ id: string }> => {
    const result = await apiPost<{ id: string }>(`/Order/scheduled/${orderId}/ride`, data);

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data!;
  },
};

export type { GetOrderDTO };


