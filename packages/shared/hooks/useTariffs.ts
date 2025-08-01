import { useState, useEffect } from 'react';
import { tariffsApi, type GetTariffDTOWithArchived, type TariffFilters } from '@shared/api/tariffs';

/**
 * Хук для загрузки тарифов
 */
export function useTariffs(filters?: TariffFilters) {
  const [tariffs, setTariffs] = useState<GetTariffDTOWithArchived[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTariffs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Загружаем тарифы с переданными фильтрами или дефолтными
        const defaultFilters: TariffFilters = {
          first: true,
          size: 100,
          archived: false, // Только активные тарифы
          sortBy: 'name',
          sortOrder: 'Asc',
          ...filters // Переопределяем дефолтные фильтры переданными
        };

        const response = await tariffsApi.getTariffs(defaultFilters);
        setTariffs(response.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки тарифов';
        setError(errorMessage);
        console.error('Failed to load tariffs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTariffs();
  }, [filters]);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const defaultFilters: TariffFilters = {
        first: true,
        size: 100,
        archived: false,
        sortBy: 'name',
        sortOrder: 'Asc',
        ...filters
      };

      const response = await tariffsApi.getTariffs(defaultFilters);
      setTariffs(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки тарифов';
      setError(errorMessage);
      console.error('Failed to refetch tariffs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tariffs,
    isLoading,
    error,
    refetch
  };
}
