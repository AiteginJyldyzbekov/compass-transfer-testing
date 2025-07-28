'use client';

import { useState, useEffect } from 'react';
import { logger } from '@shared/lib';
import { usersApi } from '@shared/api/users';
import { ActivityStatus } from '@entities/users/enums';
import type { GetUserSelfProfileDTO } from '@entities/users/interface';

interface UseProfileDataReturn {
  profile: GetUserSelfProfileDTO | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProfileData(): UseProfileDataReturn {
  const [profile, setProfile] = useState<GetUserSelfProfileDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Используем реальный API
      const data = await usersApi.getSelfProfile();

      // Добавляем недостающие поля, которые не приходят с бэкенда
      const enrichedData: GetUserSelfProfileDTO = {
        ...data,
        online: true, // Пользователь всегда онлайн на своей странице
        lastActive: new Date().toISOString(),
        status: ActivityStatus.Active,
        avatarUrl: data.avatarUrl || null,
        locationId: data.locationId || null,
      };

      setProfile(enrichedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки профиля';

      setError(errorMessage);
      logger.error('Failed to fetch user profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
  };
}
