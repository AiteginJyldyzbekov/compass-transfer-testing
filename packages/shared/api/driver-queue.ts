import { apiDelete, apiGet, apiPost } from '@shared/api/client';

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
}

/**
 * API для работы с очередью водителей
 */
export const driverQueueApi = {
  /**
   * Получить текущий статус в очереди
   * GET /DriverQueue/self
   * @returns QueueStatusResponse если в очереди (200), null если не в очереди (404)
   */
  async getQueueStatus(): Promise<QueueStatusResponse | null> {
    const result = await apiGet<QueueStatusResponse>('/DriverQueue/self');
    
    // 404 означает, что водитель не в очереди
    if (result.error && result.error.statusCode === 404) {
      return null;
    }
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.data!;
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
