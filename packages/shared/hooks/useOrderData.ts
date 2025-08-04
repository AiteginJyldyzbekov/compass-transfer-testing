import { useState, useEffect } from 'react';
import { tariffsApi, type GetTariffDTOWithArchived } from '@shared/api/tariffs';
import { servicesApi } from '@shared/api/services';
import { usersApi } from '@shared/api/users';
import type { GetServiceDTO } from '@entities/services/interface';
import type { GetUserBasicDTO } from '@entities/users/interface';

/**
 * Хук для загрузки данных необходимых для создания заказа
 */
export function useOrderData(userRole?: 'admin' | 'operator' | 'partner' | 'driver') {
  const [tariffs, setTariffs] = useState<GetTariffDTOWithArchived[]>([]);
  const [services, setServices] = useState<GetServiceDTO[]>([]);
  const [users, setUsers] = useState<GetUserBasicDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingTariffs, setIsRefreshingTariffs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Определяем, нужно ли загружать пользователей
        const shouldLoadUsers = userRole === 'admin' || userRole === 'operator';

        // Загружаем данные параллельно
        const promises = [
          // Загружаем все тарифы (включая архивные)
          tariffsApi.getTariffs({
            first: true,
            size: 100,
            sortBy: 'name',
            sortOrder: 'Asc'
          }),
          // Загружаем все услуги
          servicesApi.getServices({
            first: true,
            size: 100,
            sortBy: 'name',
            sortOrder: 'Asc'
          })
        ];

        // Добавляем загрузку пользователей только для админов и операторов
        if (shouldLoadUsers) {
          promises.push(
            usersApi.getUsers({
              first: true,
              size: 100,
              sortBy: 'firstName',
              sortOrder: 'Asc'
            })
          );
        }

        const responses = await Promise.all(promises);
        const [tariffsResponse, servicesResponse, usersResponse] = responses;

        setTariffs(tariffsResponse.data);
        setServices(servicesResponse.data);
        // Устанавливаем пользователей только если они были загружены
        setUsers(usersResponse?.data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки данных';
        setError(errorMessage);
        console.error('Failed to load order data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [tariffsResponse, servicesResponse, usersResponse] = await Promise.all([
        tariffsApi.getTariffs({ 
          first: true, 
          size: 100, 
          archived: false,
          sortBy: 'name',
          sortOrder: 'Asc'
        }),
        servicesApi.getServices({ 
          first: true, 
          size: 100,
          sortBy: 'name',
          sortOrder: 'Asc'
        }),
        usersApi.getUsers({ 
          first: true, 
          size: 100,
          sortBy: 'firstName',
          sortOrder: 'Asc'
        })
      ]);

      setTariffs(tariffsResponse.data);
      setServices(servicesResponse.data);
      setUsers(usersResponse.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки данных';
      setError(errorMessage);
      console.error('Failed to refetch order data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для обновления только тарифов
  const refetchTariffs = async () => {
    try {
      setIsRefreshingTariffs(true);
      setError(null);

      const tariffsResponse = await tariffsApi.getTariffs({
        first: true,
        size: 100,
        sortBy: 'name',
        sortOrder: 'Asc'
      });

      // tariffsResponse уже содержит данные напрямую, не нужно .data.items
      setTariffs(tariffsResponse.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки тарифов';
      setError(errorMessage);
      console.error('Ошибка загрузки тарифов:', err);
    } finally {
      setIsRefreshingTariffs(false);
    }
  };

  return {
    tariffs,
    services,
    users,
    isLoading,
    isRefreshingTariffs,
    error,
    refetch,
    refetchTariffs
  };
}
