'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { driverAuthApi, type DriverLoginRequest } from '@shared/api/driver-auth';
import { logger } from '@shared/lib/logger';

export interface UseDriverAuthResult {
  isLoading: boolean;
  actions: {
    login: (data: DriverLoginRequest) => Promise<void>;
    logout: () => void;
  };
}

/**
 * Хук для авторизации водителей
 */
export function useDriverAuth(): UseDriverAuthResult {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Авторизация водителя
  const login = useCallback(async (data: DriverLoginRequest) => {
    try {
      setIsLoading(true);
      const response = await driverAuthApi.login(data);
      
      // Сохраняем токены в localStorage
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      toast.success('✅ Вход выполнен успешно');
      logger.info('🚗 useDriverAuth.login успешно:', response.user);
      
      // Перенаправляем на главную страницу
      router.push('/');
    } catch (error) {
      logger.error('❌ useDriverAuth.login ошибка:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Ошибка авторизации';
      
      toast.error(`❌ ${errorMessage}`);
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Выход из системы
  const logout = useCallback(() => {
    try {
      // Удаляем токены из localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      toast.success('✅ Выход выполнен успешно');
      logger.info('🚗 useDriverAuth.logout успешно');
      
      // Перенаправляем на страницу входа
      router.push('/login');
    } catch (error) {
      logger.error('❌ useDriverAuth.logout ошибка:', error);
      toast.error('❌ Ошибка при выходе из системы');
    }
  }, [router]);

  return {
    isLoading,
    actions: {
      login,
      logout,
    },
  };
}
