'use client';

import { useState, useEffect } from 'react';
import { logger } from '@shared/lib';
import { locationsApi } from '@shared/api/locations';
import type { LocationDTO } from '@entities/locations/interface/LocationDTO';
import type { LocationListResponseDTO } from '@entities/locations/interface/LocationListDTO';

/**
 * Хук для получения всех локаций
 */
export const useAllLocations = (): {
  locations: LocationDTO[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} => {
  const [locations, setLocations] = useState<LocationDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await locationsApi.getLocations({
        first: true,
        size: 100, // Получаем больше локаций
        sortBy: 'name',
        sortOrder: 'Asc',
      });

      setLocations(data.data);
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Произошла ошибка при загрузке локаций';

      setError(errorMessage);
      setLocations([]);

      logger.error('Ошибка загрузки всех локаций:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

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
