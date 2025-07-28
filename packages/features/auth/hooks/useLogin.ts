'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { LoginFormData } from '@entities/auth/schemas';

// Mock функция для авторизации
const mockLogin = async (data: LoginFormData) => {
  // Имитируем задержку сети
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Простая проверка для демонстрации
  if (data.email === 'admin@example.com' && data.password === 'password123') {
    return { success: true };
  }

  return {
    success: false,
    error: 'Неверный email или пароль',
    fieldErrors: {
      email: true,
      password: true,
    },
  };
};

interface UseLoginResult {
  login: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, boolean>; // Информация о полях с ошибками
  clearFieldError: (field: string) => void; // Метод для сброса ошибки конкретного поля
}

/**
 * Хук для обработки логики авторизации
 */
export const useLogin = (): UseLoginResult => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  const login = useCallback(
    async (data: LoginFormData): Promise<void> => {
      setIsLoading(true);
      setError(null);
      setFieldErrors({}); // Сбрасываем ошибки полей

      // Отправляем запрос на авторизацию через authService с ensureMinDuration для минимального времени отображения спиннера
      // TODO: Заменить на реальный API вызов
      const result = await mockLogin(data);

      // Проверяем результат запроса
      if (!result.success) {
        // Устанавливаем сообщение об ошибке
        const errorMessage = result.error || 'Произошла неизвестная ошибка';

        setError(errorMessage);

        // Устанавливаем ошибки полей если они есть
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }

        // Показываем toast с ошибкой
        toast.error(errorMessage);
      } else {
        // Показываем уведомление об успешном входе и перенаправляем на главную страницу
        toast.success('Вход выполнен успешно!');
        router.push('/dashboard');
      }

      setIsLoading(false);
    },
    [router],
  );

  // Метод для сброса ошибки конкретного поля
  const clearFieldError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };

      delete newErrors[field];

      return newErrors;
    });
  }, []);

  return { login, isLoading, error, fieldErrors, clearFieldError };
};
