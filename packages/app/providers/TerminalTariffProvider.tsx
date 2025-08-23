'use client';

import React, { useState, useEffect, useCallback, type ReactNode } from 'react';
import { tariffsApi } from '@shared/api/tariffs';
import { TerminalTariffContext, type TerminalTariffContextType } from '@entities/tariffs/context/TerminalTariffContext';
import { CarType } from '@entities/tariffs/enums/CarType.enum';
import { ServiceClass } from '@entities/tariffs/enums/ServiceClass.enum';
import type { GetTariffDTO } from '@entities/tariffs/interface/GetTariffDTO';

interface TerminalTariffProviderProps {
  children: ReactNode;
}

/**
 * Провайдер контекста тарифов для терминала
 * Автоматически загружает тарифы и находит эконом седан при монтировании
 */
export const TerminalTariffProvider: React.FC<TerminalTariffProviderProps> = ({ children }) => {
  const [tariffs, setTariffs] = useState<GetTariffDTO[]>([]);
  const [economyTariff, setEconomyTariff] = useState<GetTariffDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Функция для загрузки тарифов
  const fetchTariffs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Загружаем все активные тарифы
      const response = await tariffsApi.getTariffs({
        archived: false,
        size: 100 // Загружаем достаточно тарифов
      });

      const allTariffs = response.data;
      
      setTariffs(allTariffs);

      // Ищем эконом седан
      const economySedan = allTariffs.find(tariff => 
        tariff.serviceClass === ServiceClass.Economy && 
        tariff.carType === CarType.Sedan
      );

      setEconomyTariff(economySedan || null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки тарифов';
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Загружаем тарифы при монтировании
  useEffect(() => {
    fetchTariffs();
  }, [fetchTariffs]);

  const value: TerminalTariffContextType = {
    economyTariff,
    tariffs,
    isLoading,
    error,
  };

  return (
    <TerminalTariffContext.Provider value={value}>
      {children}
    </TerminalTariffContext.Provider>
  );
};