'use client';

import { useState, useEffect, useCallback } from 'react';
import { ordersApi } from '@shared/api/orders';
import type { GetOrderDTO } from '@entities/orders/interface';
import { OrderStatus } from '@entities/orders/enums';

export interface DriverOrdersData {
  scheduled: GetOrderDTO[];
  active: GetOrderDTO[];
  completed: GetOrderDTO[];
}

export const useDriverOrders = (driverId: string | null) => {
  const [orders, setOrders] = useState<DriverOrdersData>({
    scheduled: [],
    active: [],
    completed: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDriverOrders = useCallback(async () => {
    if (!driverId) {
      setOrders({ scheduled: [], active: [], completed: [] });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Получаем заказы водителя с фильтрацией по статусам
      // Примечание: API может не поддерживать фильтрацию по driverId напрямую
      // В этом случае нужно получить все заказы и отфильтровать на клиенте
      const [scheduledResponse, activeResponse, completedResponse] = await Promise.all([
        ordersApi.getOrders({
          status: [OrderStatus.Scheduled],
          size: 50, // Увеличиваем размер для фильтрации на клиенте
        }),
        ordersApi.getOrders({
          status: [OrderStatus.InProgress],
          size: 50,
        }),
        ordersApi.getOrders({
          status: [OrderStatus.Completed],
          size: 50,
        }),
      ]);

      // Фильтруем заказы по водителю на клиенте
      // Предполагаем, что в заказе есть поле driverId или rides с информацией о водителе
      const filterOrdersByDriver = (orders: GetOrderDTO[]) => {
        return orders.filter(order => {
          // Проверяем, есть ли информация о водителе в заказе
          // Это зависит от структуры GetOrderDTO
          return true; // Временно возвращаем все заказы
        });
      };

      setOrders({
        scheduled: filterOrdersByDriver(scheduledResponse.data),
        active: filterOrdersByDriver(activeResponse.data),
        completed: filterOrdersByDriver(completedResponse.data),
      });
    } catch (err) {
      console.error('Ошибка при получении заказов водителя:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  }, [driverId]);

  useEffect(() => {
    fetchDriverOrders();
  }, [fetchDriverOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchDriverOrders,
  };
};
