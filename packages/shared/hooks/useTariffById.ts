'use client'

import { useState, useEffect } from 'react';
import { tariffsApi, type GetTariffDTOWithArchived } from '@shared/api/tariffs';

/**
 * Хук для загрузки тарифа по ID
 */
export function useTariffById(tariffId: string | null | undefined) {
  const [tariff, setTariff] = useState<GetTariffDTOWithArchived | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tariffId) {
      setTariff(null);
      setIsLoading(false);
      setError(null);

      return;
    }

    const loadTariff = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const tariffData = await tariffsApi.getTariffById(tariffId);

        setTariff(tariffData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки тарифа';
        
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadTariff();
  }, [tariffId]);

  const refetch = async () => {
    if (!tariffId) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const tariffData = await tariffsApi.getTariffById(tariffId);


      setTariff(tariffData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки тарифа';
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tariff,
    isLoading,
    error,
    refetch
  };
}
