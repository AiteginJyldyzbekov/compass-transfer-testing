'use client';

import React, { useState, useEffect, useCallback, type ReactNode } from 'react';
import { locationsApi } from '@shared/api/locations';
import { usersApi } from '@shared/api/users';
import type { GetLocationDTO } from '@entities/locations/interface';
import { TerminalDataContext, type TerminalDataContextType } from '@entities/users/context/TerminalDataContext';
import type { GetTerminalDTO } from '@entities/users/interface';

interface TerminalDataProviderProps {
  children: ReactNode;
}

/**
 * Провайдер данных терминала
 * Использует сервисы для получения профиля пользователя и локации терминала
 */
export const TerminalDataProvider: React.FC<TerminalDataProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<GetTerminalDTO | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [terminalLocation, setTerminalLocation] = useState<GetLocationDTO | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Функция для загрузки профиля пользователя
  const fetchProfile = useCallback(async () => {
    setIsProfileLoading(true);
    setProfileError(null);

    try {
      // Получаем профиль текущего пользователя (терминала)
      const userProfile = await usersApi.getSelfProfile();

      setProfile(userProfile as GetTerminalDTO);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ошибка загрузки профиля пользователя';

      setProfileError(errorMessage);
    } finally {
      setIsProfileLoading(false);
    }
  }, []);

  // Функция для загрузки локации терминала
  const fetchTerminalLocation = useCallback(async (locationId: string) => {
    setIsLocationLoading(true);
    setLocationError(null);

    try {
      // Получаем локацию терминала по ID
      const location = await locationsApi.getLocationById(locationId);

      if (!location) {
        throw new Error('Локация терминала не найдена');
      }
      setTerminalLocation(location);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки локации терминала';

      setLocationError(errorMessage);
    } finally {
      setIsLocationLoading(false);
    }
  }, []);

  // Функция для обновления профиля
  const refetchProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  // Функция для обновления локации
  const refetchLocation = useCallback(async () => {
    if (profile?.locationId) {
      await fetchTerminalLocation(profile.locationId);
    }
  }, [profile?.locationId, fetchTerminalLocation]);

  // Функция для обновления всех данных
  const refetchAll = useCallback(async () => {
    await fetchProfile();
    if (profile?.locationId) {
      await fetchTerminalLocation(profile.locationId);
    }
  }, [fetchProfile, profile?.locationId, fetchTerminalLocation]);

  // Загружаем профиль при монтировании
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Загружаем локацию когда получили профиль с locationId
  useEffect(() => {
    if (profile?.locationId && !isProfileLoading) {
      fetchTerminalLocation(profile.locationId);
    }
  }, [profile?.locationId, isProfileLoading, fetchTerminalLocation]);

  // Вычисляем общие состояния
  const isLoading = isProfileLoading || isLocationLoading;
  const error = profileError || locationError;

  const value: TerminalDataContextType = {
    // Профиль пользователя
    profile,
    isProfileLoading,
    profileError,

    // Локация терминала
    terminalLocation,
    isLocationLoading,
    locationError,

    // Общие состояния
    isLoading,
    error,

    // Методы
    refetchProfile,
    refetchLocation,
    refetchAll,
  };

  return <TerminalDataContext.Provider value={value}>{children}</TerminalDataContext.Provider>;
};
