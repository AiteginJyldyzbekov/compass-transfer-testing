'use client';

import { useState, useEffect, useCallback } from 'react';
import { locationsApi } from '@shared/api/locations';
import { logger } from '@shared/lib';
import type { LocationDTO } from '@entities/locations/interface/LocationDTO';

interface UseLocationResult {
  location: LocationDTO | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Хук для получения локации по ID
 */
export const useLocation = (locationId: string | null): UseLocationResult => {
  const [location, setLocation] = useState<LocationDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(async () => {
    if (!locationId) {
      setLocation(null);
      setIsLoading(false);
      setError(null);

      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const locationData = await locationsApi.getLocationById(locationId);

      setLocation(locationData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Произошла ошибка при загрузке локации';

      setError(errorMessage);
      setLocation(null);
      logger.error('Ошибка загрузки локации:', err);
    } finally {
      setIsLoading(false);
    }
  }, [locationId]);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const refetch = async () => {
    await fetchLocation();
  };

  return {
    location,
    isLoading,
    error,
    refetch,
  };
};

// Глобальный кэш для локаций
const locationsCache = new Map<string, LocationDTO>();
const loadingPromises = new Map<string, Promise<LocationDTO>>();

/**
 * Хук для получения нескольких локаций по массиву ID с кэшированием
 */
export const useLocations = (
  locationIds: string[],
): {
  locations: LocationDTO[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} => {
  const [locations, setLocations] = useState<LocationDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = useCallback(async () => {
    if (!locationIds.length) {
      setLocations([]);
      setIsLoading(false);
      setError(null);

      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results: LocationDTO[] = [];
      const toFetch: string[] = [];

      // Проверяем кэш и собираем ID для загрузки
      for (const id of locationIds) {
        const cached = locationsCache.get(id);

        if (cached) {
          results.push(cached);
        } else if (loadingPromises.has(id)) {
          // Если уже загружается, ждем результат
          try {
            const location = await loadingPromises.get(id)!;

            results.push(location);
          } catch {
            // Игнорируем ошибки отдельных локаций
          }
        } else {
          toFetch.push(id);
        }
      }

      // Загружаем недостающие локации
      if (toFetch.length > 0) {
        const fetchPromises = toFetch.map(async (id) => {
          const promise = locationsApi.getLocationById(id);

          loadingPromises.set(id, promise);

          try {
            const location = await promise;

            locationsCache.set(id, location);
            loadingPromises.delete(id);

            return location;
          } catch (error) {
            loadingPromises.delete(id);
            throw error;
          }
        });

        const fetchResults = await Promise.allSettled(fetchPromises);
        
        // Добавляем успешно загруженные локации
        fetchResults.forEach((result) => {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          }
        });
      }

      // Сортируем результаты в том же порядке, что и входные ID
      const sortedLocations = locationIds
        .map(id => results.find(loc => loc.id === id))
        .filter((loc): loc is LocationDTO => loc !== undefined);

      setLocations(sortedLocations);

      if (sortedLocations.length !== locationIds.length) {
        setError(`Найдено ${sortedLocations.length} из ${locationIds.length} локаций`);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Произошла ошибка при загрузке локаций';

      setError(errorMessage);
      setLocations([]);
      logger.error('Ошибка загрузки локаций:', err);
    } finally {
      setIsLoading(false);
    }
  }, [locationIds]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const refetch = async () => {
    // Очищаем кэш для этих локаций при принудительном обновлении
    locationIds.forEach(id => {
      locationsCache.delete(id);
      loadingPromises.delete(id);
    });
    await fetchLocations();
  };

  return {
    locations,
    isLoading,
    error,
    refetch,
  };
};
