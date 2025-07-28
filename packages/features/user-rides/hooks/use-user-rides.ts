'use client';

import { useState, useEffect, useCallback } from 'react';
import { ridesApi } from '@shared/api/rides';
import { logger } from '@shared/lib';
import type { GetRideDTO } from '@entities/rides/interface';

interface UseUserRidesReturn {
  rides: GetRideDTO[];
  total: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUserRides(userId: string): UseUserRidesReturn {
  const [rides, setRides] = useState<GetRideDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRides = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (userId) {
        const result = await ridesApi.getUserRides(userId, { Size: 10 });
        setRides(result.data || []);
        setTotal(result.total || 0);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки поездок пользователя';

      setError(errorMessage);
      logger.error('Failed to fetch user rides:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const refetch = useCallback(() => {
    return fetchUserRides();
  }, [fetchUserRides]);

  useEffect(() => {
    fetchUserRides();
  }, [fetchUserRides]);

  return {
    rides,
    total,
    isLoading,
    error,
    refetch,
  };
}
