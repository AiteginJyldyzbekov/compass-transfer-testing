import { useState, useLayoutEffect, useCallback, useRef } from 'react';
import { usersApi } from '@shared/api/users';
import { logger } from '@shared/lib';
import type { User } from '@entities/user';

interface UseUserDataOptions {
  userId?: string;
  userRole?: string;
  autoLoad?: boolean;
}

interface UseUserDataReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  loadUser: (id: string) => Promise<void>;
  loadUserByRole: (role: string, id: string) => Promise<void>;
  reset: () => void;
  refresh: () => Promise<void>;
}

export function useUserData({ 
  userId, 
  userRole, 
  autoLoad = true 
}: UseUserDataOptions = {}): UseUserDataReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Используем ref для хранения текущих параметров
  const currentParams = useRef({ userId, userRole, autoLoad });

  currentParams.current = { userId, userRole, autoLoad };

  // Мемоизированная функция загрузки пользователя
  const loadUser = useCallback(async (id: string) => {
    // Проверяем, не изменились ли параметры во время загрузки
    if (currentParams.current.userId !== userId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Сначала получаем базовую информацию о пользователе
      const basicUserData = await usersApi.getUserById(id);
      
      // Проверяем, не изменились ли параметры во время загрузки
      if (currentParams.current.userId !== userId) {
        return;
      }
      
      // Затем получаем полную информацию в зависимости от роли
      const fullUserData = await usersApi.getUserByRole(basicUserData.role, id);
      
      // Финальная проверка перед установкой данных
      if (currentParams.current.userId === userId) {
        setUser(fullUserData);
      }
    } catch (err) {
      // Проверяем, не изменились ли параметры во время ошибки
      if (currentParams.current.userId === userId) {
        logger.warn('Ошибка загрузки пользователя:', err);
        setError('Не удалось загрузить данные пользователя');
      }
    } finally {
      // Проверяем, не изменились ли параметры перед сбросом загрузки
      if (currentParams.current.userId === userId) {
        setIsLoading(false);
      }
    }
  }, [userId]);

  // Мемоизированная функция загрузки пользователя по роли
  const loadUserByRole = useCallback(async (role: string, id: string) => {
    // Проверяем, не изменились ли параметры во время загрузки
    if (currentParams.current.userRole !== userRole || currentParams.current.userId !== userId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fullUserData = await usersApi.getUserByRole(role, id);
      
      // Проверяем, не изменились ли параметры перед установкой данных
      if (currentParams.current.userRole === userRole && currentParams.current.userId === userId) {
        setUser(fullUserData);
      }
    } catch (err) {
      // Проверяем, не изменились ли параметры во время ошибки
      if (currentParams.current.userRole === userRole && currentParams.current.userId === userId) {
        logger.warn('Ошибка загрузки пользователя по роли:', err);
        setError('Не удалось загрузить данные пользователя');
      }
    } finally {
      // Проверяем, не изменились ли параметры перед сбросом загрузки
      if (currentParams.current.userRole === userRole && currentParams.current.userId === userId) {
        setIsLoading(false);
      }
    }
  }, [userRole, userId]);

  // Мемоизированная функция сброса
  const reset = useCallback(() => {
    setUser(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // Мемоизированная функция обновления данных
  const refresh = useCallback(async () => {
    if (userId) {
      await loadUser(userId);
    } else if (userRole && userId) {
      await loadUserByRole(userRole, userId);
    }
  }, [userId, userRole, loadUser, loadUserByRole]);

  // Минимальное использование useLayoutEffect только для автоматической загрузки
  useLayoutEffect(() => {
    if (autoLoad && userId && !userRole) {
      loadUser(userId);
    }
  }, [userId, userRole, autoLoad, loadUser]);

  useLayoutEffect(() => {
    if (autoLoad && userRole && userId) {
      loadUserByRole(userRole, userId);
    }
  }, [userRole, userId, autoLoad, loadUserByRole]);

  return {
    user,
    isLoading,
    error,
    loadUser,
    loadUserByRole,
    reset,
    refresh,
  };
}
