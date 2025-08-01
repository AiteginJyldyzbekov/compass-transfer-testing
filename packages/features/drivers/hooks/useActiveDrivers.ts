'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { apiClient } from '@shared/api';
import type { MapBounds } from '@shared/components/map/types';
import { logger } from '@shared/lib';

export interface ActiveDriver {
  id: string;
  type: 'Sedan' | 'Hatchback' | 'SUV' | 'Minivan' | 'Coupe' | 'Cargo' | 'Pickup';
  serviceClass: 'Economy' | 'Comfort' | 'ComfortPlus' | 'Business' | 'Premium' | 'Vip' | 'Luxury';
  currentLocation: {
    latitude: number;
    longitude: number;
  };
}

interface CachedBounds {
  latFrom: number;
  latTo: number;
  longFrom: number;
  longTo: number;
}

/**
 * Хук для работы с активными водителями
 */
export const useActiveDrivers = () => {
  const [drivers, setDrivers] = useState<ActiveDriver[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Кэшируем последние границы запроса
  const cachedBoundsRef = useRef<CachedBounds | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Проверяем, нужно ли делать новый запрос на основе границ
   */
  const shouldFetchDrivers = useCallback((bounds: MapBounds): boolean => {
    if (!cachedBoundsRef.current) return true;

    const cached = cachedBoundsRef.current;
    
    // Если новые границы шире кэшированных, нужен новый запрос
    return (
      bounds.latFrom < cached.latFrom ||
      bounds.latTo > cached.latTo ||
      bounds.longFrom < cached.longFrom ||
      bounds.longTo > cached.longTo
    );
  }, []);

  /**
   * Загружает активных водителей в указанных границах
   */
  const fetchActiveDrivers = useCallback(async (bounds: MapBounds) => {
    if (!shouldFetchDrivers(bounds)) {

      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = {
        LatFrom: bounds.latFrom,
        LatTo: bounds.latTo,
        LongFrom: bounds.longFrom,
        LongTo: bounds.longTo,
      };

      const response = await apiClient.get<ActiveDriver[]>('/GIS/ActiveDrivers', { params });

      if (response.error) {
        throw new Error(response.error.message || 'Ошибка при загрузке активных водителей');
      }

      const driversData = Array.isArray(response.data) ? response.data : [];

      setDrivers(driversData);
      
      // Обновляем кэшированные границы
      cachedBoundsRef.current = {
        latFrom: bounds.latFrom,
        latTo: bounds.latTo,
        longFrom: bounds.longFrom,
        longTo: bounds.longTo,
      };

      logger.log('Загружено активных водителей:', driversData.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при загрузке активных водителей';

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [shouldFetchDrivers]);

  /**
   * Запускает периодическое обновление водителей каждые 30 секунд
   */
  const startPeriodicUpdate = useCallback((bounds: MapBounds) => {
    // Очищаем предыдущий интервал
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Запускаем новый интервал
    intervalRef.current = setInterval(() => {
      if (cachedBoundsRef.current) {
        fetchActiveDrivers(bounds);
      }
    }, 30000); // 30 секунд
  }, [fetchActiveDrivers]);

  /**
   * Останавливает периодическое обновление
   */
  const stopPeriodicUpdate = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      logger.log('Остановлено периодическое обновление водителей');
    }
  }, []);

  /**
   * Обновляет границы карты и загружает водителей при необходимости
   */
  const updateMapBounds = useCallback((bounds: MapBounds) => {
    fetchActiveDrivers(bounds);
    startPeriodicUpdate(bounds);
  }, [fetchActiveDrivers, startPeriodicUpdate]);

  // Очищаем интервал при размонтировании компонента
  useEffect(() => {
    return () => {
      stopPeriodicUpdate();
    };
  }, [stopPeriodicUpdate]);

  return {
    drivers,
    isLoading,
    error,
    fetchActiveDrivers,
    updateMapBounds,
    stopPeriodicUpdate,
  };
};
