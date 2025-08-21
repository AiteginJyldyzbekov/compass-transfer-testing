'use client'

import { useState, useEffect } from 'react';
import { usersApi } from '@shared/api/users';
import type { GetDriverDTO } from '@entities/users/interface';

/**
 * Хук для загрузки водителя по ID
 */
export function useDriverById(driverId: string | null | undefined) {
  const [driver, setDriver] = useState<GetDriverDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!driverId) {
      setDriver(null);
      setIsLoading(false);
      setError(null);

      return;
    }

    const loadDriver = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const driverData = await usersApi.getDriver(driverId);

        setDriver(driverData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки водителя';

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadDriver();
  }, [driverId]);

  const refetch = async () => {
    if (!driverId) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const driverData = await usersApi.getDriver(driverId);

      setDriver(driverData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки водителя';
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    driver,
    isLoading,
    error,
    refetch
  };
}
