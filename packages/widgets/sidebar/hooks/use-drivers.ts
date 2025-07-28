'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { usersApi } from '@shared/api/users';
import type { GetDriverDTO } from '@entities/users/interface';

// Интерфейс для водителя в сайдбаре (упрощенный)
export interface SidebarDriver {
  id: string;
  name: string;
  phone: string;
  carNumber: string;
}

// Функция для преобразования GetDriverDTO в SidebarDriver
const mapDriverToSidebarDriver = (driver: GetDriverDTO): SidebarDriver => ({
  id: driver.id,
  name: driver.fullName,
  phone: driver.phoneNumber || '',
  carNumber: driver.activeCar?.licensePlate || 'Нет авто',
});

// Функция для глубокого сравнения массивов водителей
const areDriversEqual = (drivers1: SidebarDriver[], drivers2: SidebarDriver[]): boolean => {
  if (drivers1.length !== drivers2.length) return false;
  
  return drivers1.every((driver1, index) => {
    const driver2 = drivers2[index];
    return (
      driver1.id === driver2.id &&
      driver1.name === driver2.name &&
      driver1.phone === driver2.phone &&
      driver1.carNumber === driver2.carNumber
    );
  });
};

export const useDrivers = (enabled: boolean = true) => {
  const [drivers, setDrivers] = useState<SidebarDriver[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const fetchDrivers = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const response = await usersApi.getDrivers({
        first: true,
        size: 50,
        online: true,
      });

      const newDrivers = response.data.map(mapDriverToSidebarDriver);
      
      // Сравниваем новые данные с текущими
      setDrivers(prevDrivers => {
        if (areDriversEqual(prevDrivers, newDrivers)) {
          // Данные не изменились, возвращаем предыдущий массив
          return prevDrivers;
        }
        // Данные изменились, обновляем
        return newDrivers;
      });
    } catch (err) {
      console.error('Ошибка при получении водителей:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Первоначальная загрузка
    fetchDrivers();

    // Устанавливаем интервал для обновления каждые 30 секунд
    const interval = setInterval(fetchDrivers, 30000);

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(interval);
  }, [fetchDrivers, enabled]);

  // Мемоизируем результат для предотвращения лишних рендеров
  const result = useMemo(
    () => ({
      drivers,
      loading,
      error,
      refetch: fetchDrivers,
    }),
    [drivers, loading, error, fetchDrivers]
  );

  return result;
};
