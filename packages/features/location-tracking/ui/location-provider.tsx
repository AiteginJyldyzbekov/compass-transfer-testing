'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface LocationContextType {
  isTracking: boolean;
  lastLocation: { latitude: number; longitude: number } | null;
  error: string | null;
  permissionStatus: 'granted' | 'denied' | 'prompt' | 'unknown';
  requestLocationPermission: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

interface LocationProviderProps {
  children: React.ReactNode;
  intervalMs?: number; // Интервал отправки в миллисекундах (по умолчанию 30 секунд)
}

export function LocationProvider({ 
  children, 
  intervalMs = 30000 // 30 секунд по умолчанию
}: LocationProviderProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [lastLocation, setLastLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');

  // Функция для отправки координат на сервер
  const sendLocationToServer = useCallback(async (latitude: number, longitude: number) => {
    try {
      const { locationsApi } = await import('@shared/api/locations');

      await locationsApi.updateCurrentLocation({ latitude, longitude });
      
    } catch (error) {
      toast.error('Ошибка отправки координат:');
      throw error;
    }
  }, []);

  // Функция для получения текущего местоположения
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Геолокация не поддерживается браузером');

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setLastLocation({ latitude, longitude });
        setError(null);
        
        // Отправляем координаты на сервер
        sendLocationToServer(latitude, longitude);
      },
      (error) => {
        let errorMessage = 'Ошибка получения геолокации';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            // Проверяем, не связано ли это с HTTP в dev режиме
            if (error.message.includes('secure origins') || error.message.includes('https')) {
              errorMessage = 'Геолокация требует HTTPS. В dev режиме настройте браузер или используйте HTTPS';
            } else {
              errorMessage = 'Доступ к геолокации запрещен';
            }
            setPermissionStatus('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Местоположение недоступно';
            break;
          case error.TIMEOUT:
            errorMessage = 'Время ожидания геолокации истекло';
            break;
        }
        
        setError(errorMessage);
        toast.error('Ошибка геолокации:');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // Кэш на 1 минуту
      }
    );
  }, [sendLocationToServer]);

  // Проверка разрешений на геолокацию
  const checkPermissions = useCallback(async () => {
    if (!navigator.permissions) {
      setPermissionStatus('unknown');

      return;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });

      setPermissionStatus(permission.state as 'granted' | 'denied' | 'prompt');
      
      permission.addEventListener('change', () => {
        setPermissionStatus(permission.state as 'granted' | 'denied' | 'prompt');
      });
    } catch {
      setPermissionStatus('unknown');
    }
  }, []);

  // Функция для ручного запроса разрешения на геолокацию
  const requestLocationPermission = useCallback(async () => {
    try {
      setError(null);
      
      // Сначала пробуем получить геолокацию (это автоматически запросит разрешение)
      await new Promise<void>((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Геолокация не поддерживается браузером'));

          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;

            setLastLocation({ latitude, longitude });
            setPermissionStatus('granted');
            sendLocationToServer(latitude, longitude);
            resolve();
          },
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              setPermissionStatus('denied');
            }
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          }
        );
      });
      
      toast.success('Геолокация активирована');
    } catch (error: unknown) {
      let errorMessage = 'Ошибка запроса разрешения геолокации';
      
      if (error && typeof error === 'object' && 'code' in error && error.code === 1) { // PERMISSION_DENIED
        errorMessage = 'Доступ к геолокации запрещен. Разрешите доступ в настройках браузера.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [sendLocationToServer]);

  // Инициализация отслеживания
  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  // Отдельный эффект для реакции на изменение permissionStatus
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (permissionStatus === 'granted') {
      // Не вызываем getCurrentLocation() сразу, так как координаты уже получены в requestLocationPermission
      setIsTracking(true);

      // Устанавливаем интервал только если разрешение есть
      intervalId = setInterval(() => {
        getCurrentLocation();
      }, intervalMs);
    } else if (permissionStatus === 'denied') {
      setIsTracking(false);
      setError('Доступ к геолокации запрещен');
    } else if (permissionStatus === 'prompt' || permissionStatus === 'unknown') {
      setIsTracking(false);
      // Автоматически запрашиваем разрешение при первой загрузке
      requestLocationPermission();
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [permissionStatus, getCurrentLocation, intervalMs, requestLocationPermission]);

  const contextValue: LocationContextType = {
    isTracking,
    lastLocation,
    error,
    permissionStatus,
    requestLocationPermission,
  };

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextType {
  const context = useContext(LocationContext);

  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  
  return context;
}
