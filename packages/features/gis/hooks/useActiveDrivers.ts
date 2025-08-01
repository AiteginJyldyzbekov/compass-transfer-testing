'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { CarType, ServiceClass } from '@entities/tariff/enums';
import {
  getActiveDrivers,
  type ActiveDriverDTO,
  type GetActiveDriversParams,
} from '@features/gis/api';

/**
 * Хук для получения активных водителей в зоне карты
 * SRP: отвечает только за GIS логику - загрузку водителей по границам карты
 * ✅ ДОБАВЛЕНО: Поддержка фильтрации по типу автомобиля и классу обслуживания
 */
export const useActiveDrivers = (carType?: CarType, serviceClass?: ServiceClass) => {
  const [activeDrivers, setActiveDrivers] = useState<ActiveDriverDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Стабилизируем фильтры для предотвращения бесконечного цикла
  const stableFilters = useMemo(() => ({ carType, serviceClass }), [carType, serviceClass]);

  // Refs для дебаунса и интервала
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastParamsRef = useRef<GetActiveDriversParams | null>(null);
  const lastBoundsRef = useRef<string | null>(null);

  /**
   * Загружает активных водителей в указанной зоне
   */
  const loadActiveDriversInternal = useCallback(
    async (params: GetActiveDriversParams) => {
      try {
        // console.log('useActiveDrivers: loadActiveDriversInternal called with params:', params);
        // console.log('useActiveDrivers: current filters:', stableFilters);

        setIsLoading(true);
        setError(null);

        // Добавляем фильтры к параметрам если они указаны
        const paramsWithFilters = {
          ...params,
          ...(stableFilters.carType && { carType: stableFilters.carType }),
          ...(stableFilters.serviceClass && { serviceClass: stableFilters.serviceClass })
        };

        // console.log('useActiveDrivers: final params for API call:', paramsWithFilters);
        const drivers = await getActiveDrivers(paramsWithFilters);
        // console.log('useActiveDrivers: received drivers:', drivers);

        setActiveDrivers(drivers);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Ошибка загрузки активных водителей';

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [stableFilters],
  );

  /**
   * Загружает активных водителей с мгновенным первым запросом и дебаунсом для последующих
   */
  const loadActiveDrivers = useCallback(
    (params: GetActiveDriversParams) => {
      // Создаем уникальный ключ для всех параметров (границы + фильтры)
      const boundsKey = `${params.latFrom.toFixed(6)},${params.latTo.toFixed(6)},${params.longFrom.toFixed(6)},${params.longTo.toFixed(6)}`;
      const filtersKey = `${stableFilters.carType || 'none'}-${stableFilters.serviceClass || 'none'}`;
      const fullKey = `${boundsKey}:${filtersKey}`;
      
      // console.log('useActiveDrivers: checking if need to reload, current key:', fullKey, 'last key:', lastBoundsRef.current);

      // Проверяем, действительно ли параметры изменились
      if (lastBoundsRef.current === fullKey) {
        // console.log('useActiveDrivers: no changes detected, skipping request');
        return;
      }

      // console.log('useActiveDrivers: parameters changed, will make request');

      const isFirstLoad = lastBoundsRef.current === null;

      // Сохраняем новые границы и параметры
      lastBoundsRef.current = fullKey;
      lastParamsRef.current = params;

      // Очищаем предыдущий дебаунс
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      // Очищаем предыдущий интервал
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (isFirstLoad) {
        // Первый запрос - мгновенно при монтировании карты
        loadActiveDriversInternal(params);

        // Запускаем интервал для автообновления каждые 30 секунд
        intervalRef.current = setInterval(() => {
          if (lastParamsRef.current) {
            loadActiveDriversInternal(lastParamsRef.current);
          }
        }, 30000); // 30 секунд
      } else {
        // Последующие запросы - с дебаунсом (2 секунды после изменения границ)
        debounceTimeoutRef.current = setTimeout(() => {
          loadActiveDriversInternal(params);
          // Перезапускаем интервал для автообновления
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          intervalRef.current = setInterval(() => {
            if (lastParamsRef.current) {
              loadActiveDriversInternal(lastParamsRef.current);
            }
          }, 30000); // 30 секунд
        }, 2000); // 2 секунды дебаунс
      }
    },
    [loadActiveDriversInternal],
  );

  /**
   * Очищает список активных водителей и останавливает автообновление
   */
  const clearActiveDrivers = useCallback(() => {
    setActiveDrivers([]);
    setError(null);
    lastParamsRef.current = null;
    lastBoundsRef.current = null;
    // Очищаем таймеры
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    activeDrivers,
    isLoading,
    error,
    loadActiveDrivers,
    clearActiveDrivers,
  };
};
