import axios from 'axios';
import { apiDelete, apiPost } from '@shared/api/client';

/**
 * Интерфейс для ответа при вступлении в очередь
 */
export interface JoinQueueResponse {
  driverId: string;
  joinedAt: string; // RFC 3339 date-time format
  position?: number; // Позиция в очереди (если доступна)
}

/**
 * Интерфейс для текущего статуса в очереди
 */
export interface QueueStatusResponse {
  driverId: string;
  joinedAt: string; // RFC 3339 date-time format
  position: number; // Позиция в очереди
  orderId?: string; // ID заказа, если водитель сейчас выполняет заказ
}

/**
 * API для работы с очередью водителей
 */
export const driverQueueApi = {
  /**
   * Получить текущий статус в очереди
   * GET /DriverQueue/self
   * @returns QueueStatusResponse если в очереди (200), данные заказа если есть активный заказ (404), null если нет данных
   */
  async getQueueStatus(): Promise<QueueStatusResponse | null> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://api.compass.local:3032';
    
    try {
      const response = await axios.get<QueueStatusResponse>(`${API_URL}/DriverQueue/self`, {
        withCredentials: true,
      });
      return response.data || null;
    } catch (error: any) {
      // При 404 бэкенд может возвращать данные заказа в теле ответа
      if (error.response?.status === 404) {
        const responseData = error.response?.data;
        
        if (responseData && (responseData.id || responseData.orderId)) {
          // Если в 404 ответе есть данные заказа, возвращаем их как QueueStatusResponse
          return responseData as QueueStatusResponse;
        }
        return null;
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Ошибка получения статуса очереди');
    }
  },

  /**
   * Встать в очередь
   * POST /DriverQueue/self
   */
  async joinQueue() {
    const result = await apiPost<JoinQueueResponse>('/DriverQueue/self');
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.data!;
  },

  /**
   * Выйти из очереди
   * DELETE /DriverQueue/self
   */
  async leaveQueue() {
    const result = await apiDelete('/DriverQueue/self');
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.data;
  },
} as const;
