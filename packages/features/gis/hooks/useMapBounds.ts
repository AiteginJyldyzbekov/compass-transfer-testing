'use client'

import { useState, useRef, useEffect, useCallback } from 'react';
import type { GetLocationDTO } from '@entities/locations/interface';
import type { MapBounds, MapBoundsContextType } from '@features/gis/context/MapBoundsContext';
import { useLocations } from '@features/locations/hooks';

/**
 * Хук для управления границами карты и загрузки локаций
 * Содержит всю GIS логику: кэширование, дебаунсинг, оптимизация запросов
 */
export const useMapBounds = (): MapBoundsContextType => {
  const { searchLocations: searchLocationsHook } = useLocations();

  // === СОСТОЯНИЕ ===
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<GetLocationDTO[]>([]);
  const [mapLocations, setMapLocations] = useState<GetLocationDTO[]>([]);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // === REFS ДЛЯ ПРЕДОТВРАЩЕНИЯ ДУБЛИРОВАНИЯ ЗАПРОСОВ ===
  const lastBoundsRef = useRef<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // === КЭШ ЛОКАЦИЙ ПО ID ===
  const locationCacheRef = useRef<Map<string, GetLocationDTO>>(new Map());
  // === АГРЕГИРОВАННЫЕ ГРАНИЦЫ, уже загруженные (union) ===
  const aggregatedBoundsRef = useRef<MapBounds | null>(null);
  // Допуск (~110м) для сравнения и расширения границ
  const EPS = 0.001;

  // === АВТОМАТИЧЕСКАЯ ЗАГРУЗКА ПРИ ИЗМЕНЕНИИ ГРАНИЦ КАРТЫ ===
  useEffect(() => {
    if (mapBounds) {
      // Создаем уникальный ключ для границ карты (как в useActiveDrivers)
      const boundsKey = `${mapBounds.latFrom.toFixed(6)},${mapBounds.latTo.toFixed(6)},${mapBounds.longFrom.toFixed(6)},${mapBounds.longTo.toFixed(6)}`;

      // Проверяем, действительно ли границы изменились
      if (lastBoundsRef.current === boundsKey) {
        return;
      }

      const isFirstLoad = lastBoundsRef.current === null;

      // Сохраняем новые границы
      lastBoundsRef.current = boundsKey;

      // Очищаем предыдущий дебаунс
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      const isBoundsInside = (current: MapBounds, master: MapBounds) => {
        return (
          current.latFrom >= master.latFrom - EPS &&
          current.latTo <= master.latTo + EPS &&
          current.longFrom >= master.longFrom - EPS &&
          current.longTo <= master.longTo + EPS
        );
      };

      const loadLocations = async () => {
        // Проверяем, входит ли текущий bbox в уже загруженный aggregatedBounds
        if (aggregatedBoundsRef.current && isBoundsInside(mapBounds, aggregatedBoundsRef.current)) {
          setMapLocations(Array.from(locationCacheRef.current.values()));

          return;
        }
        try {
          setIsMapLoading(true);
          setMapError(null);
          const results = await searchLocationsHook('', mapBounds);

          // Объединяем с кэшем
          results.forEach((loc: GetLocationDTO) => locationCacheRef.current.set(loc.id, loc));
          // Обновляем aggregatedBounds: объединяем старый bbox с новым
          if (aggregatedBoundsRef.current) {
            aggregatedBoundsRef.current = {
              latFrom: Math.min(aggregatedBoundsRef.current.latFrom, mapBounds.latFrom) - EPS,
              latTo: Math.max(aggregatedBoundsRef.current.latTo, mapBounds.latTo) + EPS,
              longFrom: Math.min(aggregatedBoundsRef.current.longFrom, mapBounds.longFrom) - EPS,
              longTo: Math.max(aggregatedBoundsRef.current.longTo, mapBounds.longTo) + EPS,
            };
          } else {
            aggregatedBoundsRef.current = {
              latFrom: mapBounds.latFrom - EPS,
              latTo: mapBounds.latTo + EPS,
              longFrom: mapBounds.longFrom - EPS,
              longTo: mapBounds.longTo + EPS,
            };
          }
          setMapLocations(Array.from(locationCacheRef.current.values()));
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Ошибка загрузки локаций для карты';

          setMapError(errorMessage);
        } finally {
          setIsMapLoading(false);
        }
      };

      if (isFirstLoad) {
        // Первый запрос - мгновенно при монтировании карты
        loadLocations();
      } else {
        // Последующие запросы - с дебаунсом (1 секунда после изменения границ)
        debounceTimeoutRef.current = setTimeout(() => {
          loadLocations();
        }, 1000); // 1 секунда дебаунс
      }
    }

    // Cleanup функция
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [mapBounds, searchLocationsHook]);

  // === МЕТОДЫ ДЛЯ ВЫБРАННЫХ ЛОКАЦИЙ ===
  const addLocation = useCallback((location: GetLocationDTO) => {
    setSelectedLocations(prev => {
      if (prev.find(loc => loc.id === location.id)) {
        return prev; // Уже есть
      }

      return [...prev, location];
    });
  }, []);

  const removeLocation = useCallback((locationId: string) => {
    setSelectedLocations(prev => prev.filter(loc => loc.id !== locationId));
  }, []);

  const clearLocations = useCallback(() => {
    setSelectedLocations([]);
  }, []);

  // === ВОЗВРАЩАЕМ ЗНАЧЕНИЕ КОНТЕКСТА ===
  return {
    // Карта и границы
    mapBounds,
    setMapBounds,

    // Локации для карты (по границам)
    mapLocations,
    isMapLoading,
    mapError,

    // Выбранные локации (синхронизация между картой и селектором)
    selectedLocations,
    addLocation,
    removeLocation,
    clearLocations,
    setSelectedLocations,
  };
};
