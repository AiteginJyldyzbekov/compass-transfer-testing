'use client'

import { useState, useEffect } from 'react';
import { usersApi } from '@shared/api/users';
import type { GetUserBasicDTO } from '@entities/users/interface';

/**
 * Хук для загрузки пользователя по ID
 */
export function useUserById(userId: string | null | undefined) {
  const [user, setUser] = useState<GetUserBasicDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setUser(null);
      setIsLoading(false);
      setError(null);

      return;
    }

    const loadUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userData = await usersApi.getUserById(userId);

        setUser(userData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки пользователя';

        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  const refetch = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const userData = await usersApi.getUserById(userId);

      setUser(userData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки пользователя';
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    error,
    refetch
  };
}
