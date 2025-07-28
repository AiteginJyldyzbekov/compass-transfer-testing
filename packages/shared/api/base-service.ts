import type { AxiosRequestConfig } from 'axios';
import { apiGet, apiPost, apiPut, apiPatch, apiDelete, type ApiResult } from '@shared/api/client';

/**
 * Базовый класс для API сервисов
 * Предоставляет унифицированные методы для работы с API
 */
export abstract class BaseApiService {
  protected abstract baseUrl: string;

  /**
   * GET запрос
   */
  protected async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    const url = this.buildUrl(endpoint);

    return apiGet<T>(url, config);
  }

  /**
   * POST запрос
   */
  protected async post<T, D = Record<string, unknown>>(
    endpoint: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResult<T>> {
    const url = this.buildUrl(endpoint);

    return apiPost<T, D>(url, data, config);
  }

  /**
   * PUT запрос
   */
  protected async put<T, D = Record<string, unknown>>(
    endpoint: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResult<T>> {
    const url = this.buildUrl(endpoint);

    return apiPut<T, D>(url, data, config);
  }

  /**
   * PATCH запрос
   */
  protected async patch<T, D = Record<string, unknown>>(
    endpoint: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<ApiResult<T>> {
    const url = this.buildUrl(endpoint);

    return apiPatch<T, D>(url, data, config);
  }

  /**
   * DELETE запрос
   */
  protected async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResult<T>> {
    const url = this.buildUrl(endpoint);

    return apiDelete<T>(url, config);
  }

  /**
   * Построение полного URL
   */
  private buildUrl(endpoint: string): string {
    // Убираем слеши в начале endpoint если они есть
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    // Убираем слеши в конце baseUrl если они есть
    const cleanBaseUrl = this.baseUrl.endsWith('/') ? this.baseUrl.slice(0, -1) : this.baseUrl;

    return `${cleanBaseUrl}/${cleanEndpoint}`;
  }

  /**
   * Обработка результата API запроса
   * Возвращает данные или выбрасывает ошибку
   */
  protected handleApiResult<T>(result: ApiResult<T>): T {
    if (result.error) {
      throw result.error;
    }
    if (result.data === undefined) {
      throw new Error('API returned undefined data');
    }

    return result.data;
  }

  /**
   * Безопасная обработка результата API запроса
   * Возвращает данные или null в случае ошибки
   */
  protected handleApiResultSafe<T>(result: ApiResult<T>): T | null {
    if (result.error || result.data === undefined) {
      return null;
    }

    return result.data;
  }
}
