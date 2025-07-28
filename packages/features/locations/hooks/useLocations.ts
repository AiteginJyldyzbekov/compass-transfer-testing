'use client'

import { useState, useCallback } from 'react';
import { apiClient } from '@shared/api';
import type { GetLocationDTO } from '@entities/locations/interface';

/**
 * Хук для работы с локациями
 */
export const useLocations = () => {
  const [locations, setLocations] = useState<GetLocationDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /**
   * Загружает список всех локаций
   */
  const fetchLocations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{
        data: GetLocationDTO[];
        totalCount: number;
        pageSize: number;
        hasPrevious: boolean;
        hasNext: boolean;
      }>('/Location');

      if (response.error) {
        throw new Error(response.error.message || 'Ошибка при загрузке локаций');
      }
      // API возвращает объект с массивом data
      if (response.data && Array.isArray(response.data.data)) {
        setLocations(response.data.data);
        console.log('Загружено локаций:', response.data.data.length);
      } else {
        console.warn('Неожиданный формат данных от API локаций:', response.data);
        setLocations([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при загрузке локаций';

      setError(errorMessage);
      console.error('Ошибка при загрузке локаций:', err);
    } finally {
      setIsLoading(false);
    }
  };
  /**
   * Поиск локаций по строке и/или координатному прямоугольнику.
   * @param query Строка поиска (Address)
   * @param bounds Ограничивающий прямоугольник { latFrom, latTo, longFrom, longTo }
   */
  const searchLocations = async (
    query: string = '',
    bounds?: { latFrom: number; latTo: number; longFrom: number; longTo: number },
  ): Promise<GetLocationDTO[]> => {
    try {
      // Базовые параметры
      const params: Record<string, string | number | boolean> = {
        First: true,
      };

      // Если есть строка поиска – добавляем ограничение размера
      if (query.trim()) {
        params['Size'] = 20;
      }

      if (query.trim()) {
        params['Address'] = query.trim();
        params['AddressOp'] = 'Contains';
      }

      // Координатный прямоугольник
      if (bounds) {
        params['CoordinateBox.LatFrom'] = bounds.latFrom;
        params['CoordinateBox.LatTo'] = bounds.latTo;
        params['CoordinateBox.LongFrom'] = bounds.longFrom;
        params['CoordinateBox.LongTo'] = bounds.longTo;
      }

      const response = await apiClient.get<{
        data: GetLocationDTO[];
        totalCount: number;
      }>('/Location', { params });

      const results = Array.isArray(response.data?.data) ? response.data.data : [];

      // Кэшируем в локальном состоянии, если query пустой (начальный загруз) или если это первый запрос
      if (!query.trim()) {
        setLocations(results);
      }

      return results;
    } catch (err) {
      console.error('Ошибка при поиске локаций через API:', err);

      return [];
    }
  };
  /**
   * Получить локацию по ID из загруженного списка
   */
  const getLocationById = (id: string): GetLocationDTO | undefined => {
    return locations.find(location => location.id === id);
  };
  /**
   * Получить локацию по ID через API
   */
  const fetchLocationById = useCallback(async (id: string): Promise<GetLocationDTO | null> => {
    try {
      const response = await apiClient.get<GetLocationDTO>(
        `/Location/${id}`.replace('{uuid}', id),
      );

      if (response.error) {
        console.error('Ошибка при получении локации:', response.error);

        return null;
      }

      return response.data as GetLocationDTO;
    } catch (error) {
      console.error('Ошибка при получении локации по ID:', error);

      return null;
    }
  }, []);

  return {
    locations,
    isLoading,
    error,
    fetchLocations,
    searchLocations,
    getLocationById,
    fetchLocationById,
  };
};
