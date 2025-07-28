'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { TerminalLoginFormData } from '@entities/auth/schemas';

// Mock функция для авторизации терминала
const mockTerminalLogin = async (data: TerminalLoginFormData) => {
  // Имитируем задержку сети
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Простая проверка для демонстрации
  if (data.email === 'terminal@example.com' && data.password === 'terminal123') {
    return { success: true };
  }

  return {
    success: false,
    error: 'Неверный email или пароль терминала',
    fieldErrors: {
      email: true,
      password: true,
    },
  };
};

interface UseTerminalLoginResult {
  login: (data: TerminalLoginFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, boolean>;
  clearFieldError: (field: string) => void;
}

/**
 * Хук для обработки логики авторизации терминала
 */
export const useTerminalLogin = (): UseTerminalLoginResult => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  const login = useCallback(
    async (data: TerminalLoginFormData): Promise<void> => {
      setIsLoading(true);
      setError(null);
      setFieldErrors({});

      // Отправляем запрос на авторизацию терминала
      // TODO: Заменить на реальный API вызов
      const result = await mockTerminalLogin(data);

      if (!result.success) {
        const errorMessage = result.error || 'Произошла неизвестная ошибка';

        setError(errorMessage);

        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }

        toast.error(errorMessage);
      } else {
        toast.success('Вход в терминал выполнен успешно!');
        // Перенаправляем на главную страницу терминала
        router.push('/terminal');
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
