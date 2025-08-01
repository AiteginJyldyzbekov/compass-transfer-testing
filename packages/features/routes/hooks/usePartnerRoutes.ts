'use client';

import { useState, useEffect } from 'react';
import { logger } from '@shared/lib';
import { routesApi } from '@shared/api/routes';
import type { PartnerRouteDTO } from '@entities/routes/interface/PartnerRouteDTO';

/**
 * Хук для получения маршрутов партнера
 */
export const usePartnerRoutes = (partnerId: string | null): {
  routes: PartnerRouteDTO[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
} => {
  const [routes, setRoutes] = useState<PartnerRouteDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = async () => {
    if (!partnerId) {
      setRoutes([]);
      setIsLoading(false);
      setError(null);

      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await routesApi.getPartnerRoutes(partnerId);
      setRoutes(data);
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Произошла ошибка при загрузке маршрутов';

      setError(errorMessage);
      setRoutes([]);
      logger.error('Ошибка загрузки маршрутов партнера:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [partnerId]);

  const refetch = async () => {
    await fetchRoutes();
  };

  return {
    routes,
    isLoading,
    error,
    refetch,
  };
};
