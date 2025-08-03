'use client'

import { useState, useEffect } from 'react';
import { servicesApi } from '@shared/api/services';
import type { GetServiceDTO } from '@entities/services/interface';

/**
 * Хук для загрузки всех услуг
 */
export function useServices() {
  const [services, setServices] = useState<GetServiceDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await servicesApi.getServices({
          first: true,
          size: 1000, // Получаем все услуги
          sortBy: 'name',
          sortOrder: 'Asc'
        });
        
        setServices(response.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки услуг';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await servicesApi.getServices({
        first: true,
        size: 1000,
        sortBy: 'name',
        sortOrder: 'Asc'
      });
      
      setServices(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки услуг';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    services,
    isLoading,
    error,
    refetch
  };
}
