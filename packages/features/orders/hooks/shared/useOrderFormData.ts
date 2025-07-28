'use client';

import { useState, useEffect } from 'react';
import type { GetServiceDTO } from '@entities/services/interface';
import type { GetTariffDTO } from '@entities/tariffs/interface';
import type { GetUserDTO } from '@entities/users/interface';

interface UseOrderFormDataReturn {
  tariffs: GetTariffDTO[];
  services: GetServiceDTO[];
  users: GetUserDTO[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Хук для загрузки общих данных формы заказа (тарифы, услуги)
 */
export const useOrderFormData = (): UseOrderFormDataReturn => {
  const [tariffs, setTariffs] = useState<GetTariffDTO[]>([]);
  const [services, setServices] = useState<GetServiceDTO[]>([]);
  const [users, setUsers] = useState<GetUserDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // TODO: Заменить на реальные API вызовы
        // const [tariffsResponse, servicesResponse] = await Promise.all([
        //   tariffsApi.getTariffs(),
        //   servicesApi.getServices(),
        // ]);

        // Временные моковые данные
        const mockTariffs: GetTariffDTO[] = [
          { id: '1', name: 'Эконом', basePrice: 100, description: 'Базовый тариф' },
          { id: '2', name: 'Комфорт', basePrice: 150, description: 'Комфортный тариф' },
          { id: '3', name: 'Бизнес', basePrice: 200, description: 'Бизнес тариф' },
        ];

        const mockServices: GetServiceDTO[] = [
          { id: '1', name: 'Детское кресло', price: 50, isQuantifiable: true, description: 'Детское автокресло' },
          { id: '2', name: 'Помощь с багажом', price: 30, isQuantifiable: false, description: 'Помощь водителя с багажом' },
          { id: '3', name: 'Кондиционер', price: 20, isQuantifiable: false, description: 'Включение кондиционера' },
        ];

        const mockUsers: GetUserDTO[] = [
          { id: '1', firstName: 'Иван', lastName: 'Иванов', role: 'customer' },
          { id: '2', firstName: 'Мария', lastName: 'Петрова', role: 'partner' },
          { id: '3', firstName: 'Алексей', lastName: 'Сидоров', role: 'driver' },
        ];

        setTariffs(mockTariffs);
        setServices(mockServices);
        setUsers(mockUsers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    tariffs,
    services,
    users,
    isLoading,
    error,
  };
};
