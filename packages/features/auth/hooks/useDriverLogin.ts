'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { DriverLoginFormData } from '@entities/auth/schemas';

// Mock функция для авторизации водителя
const mockDriverLogin = async (data: DriverLoginFormData) => {
  // Имитируем задержку сети
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Простая проверка для демонстрации
  if (data.phoneNumber === '+996555123456' && data.password === 'password123') {
    return { success: true };
  }

  return {
    success: false,
    error: 'Неверный номер телефона или пароль',
    fieldErrors: {
      phoneNumber: true,
      password: true,
    },
  };
};

interface UseDriverLoginResult {
  login: (data: DriverLoginFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, boolean>;
  clearFieldError: (field: string) => void;
}

/**
 * Хук для обработки логики авторизации водителя
 */
export const useDriverLogin = (): UseDriverLoginResult => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  const login = useCallback(
    async (data: DriverLoginFormData): Promise<void> => {
      setIsLoading(true);
      setError(null);
      setFieldErrors({});

      // Отправляем запрос на авторизацию водителя
      // TODO: Заменить на реальный API вызов
      const result = await mockDriverLogin(data);

      if (!result.success) {
        const errorMessage = result.error || 'Произошла неизвестная ошибка';

        setError(errorMessage);

        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }

        toast.error(errorMessage);
      } else {
        toast.success('Вход выполнен успешно!');
        // Перенаправляем на главную страницу
        router.push('/driver');
      }

      setIsLoading(false);
    },
    [router],
  );

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };

      delete newErrors[field];

      return newErrors;
    });
  }, []);

  return { login, isLoading, error, fieldErrors, clearFieldError };
};
