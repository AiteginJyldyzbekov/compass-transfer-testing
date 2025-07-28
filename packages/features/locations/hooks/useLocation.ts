'use client';

import { useState, useEffect } from 'react';
import { logger } from '@shared/lib';
import type { LocationDTO } from '@entities/locations/interface/LocationDTO';
import { getMockLocationById } from '@entities/locations/mock-data/terminal-location-mock';

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

  const fetchLocation = async () => {
    if (!locationId) {
      setLocation(null);
      setIsLoading(false);
      setError(null);

      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Заменить на реальный API вызов GET /Location/{uuid}
      const locationData = await getMockLocationById(locationId);

      if (locationData) {
        setLocation(locationData);
      } else {
        setError('Локация не найдена');
        setLocation(null);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Произошла ошибка при загрузке локации';

      setError(errorMessage);
      setLocation(null);

      if (process.env.NODE_ENV !== 'production') {
        logger.error('Ошибка загрузки локации:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, [locationId, fetchLocation]);

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

/**
 * Хук для получения нескольких локаций по массиву ID
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

  const fetchLocations = async () => {
    if (!locationIds.length) {
      setLocations([]);
      setIsLoading(false);
      setError(null);

      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Получаем все локации параллельно
      const locationPromises = locationIds.map(id => getMockLocationById(id));
      const locationResults = await Promise.all(locationPromises);

      // Фильтруем null значения
      const validLocations = locationResults.filter((loc): loc is LocationDTO => loc !== null);

      setLocations(validLocations);

      if (validLocations.length !== locationIds.length) {
        setError(`Найдено ${validLocations.length} из ${locationIds.length} локаций`);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Произошла ошибка при загрузке локаций';

      setError(errorMessage);
      setLocations([]);

      if (process.env.NODE_ENV !== 'production') {
        logger.error('Ошибка загрузки локаций:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const locationIdsString = locationIds.join(',');

  useEffect(() => {
    fetchLocations();
  }, [locationIdsString, fetchLocations]);

  const refetch = async () => {
    await fetchLocations();
  };

  return {
    locations,
    isLoading,
    error,
    refetch,
  };
};
