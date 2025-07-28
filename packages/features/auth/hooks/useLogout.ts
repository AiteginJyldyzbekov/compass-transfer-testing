'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { logger } from '@shared/lib';

// Mock функция для выхода из системы
const mockLogout = async () => {
  // Имитируем задержку сети
  await new Promise(resolve => setTimeout(resolve, 500));

  // Всегда успешный выход для демонстрации
  return { success: true };
};

/**
 * Интерфейс для опциональных действий перед выходом
 */
interface LogoutOptions {
  /** Функция выхода из очереди (для водителей) */
  leaveQueue?: () => Promise<void>;
  /** Находится ли пользователь в очереди */
  isInQueue?: boolean;
}

interface UseLogoutResult {
  logout: (options?: LogoutOptions) => Promise<void>;
  isLoggingOut: boolean;
  error: string | null;
  success: boolean;
  fieldErrors: Record<string, boolean>; // Информация о полях с ошибками
  clearFieldError: (field: string) => void; // Метод для сброса ошибки конкретного поля
}

/**
 * Хук для выхода из системы
 */
export const useLogout = (): UseLogoutResult => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  /**
   * Функция для выхода из системы
   * @param options - Опциональные действия перед выходом
   */
  const logout = async (options?: LogoutOptions) => {
    try {
      setIsLoggingOut(true);
      setError(null);
      setSuccess(false);
      setFieldErrors({}); // Сбрасываем ошибки полей

      // Если водитель в очереди, сначала выходим из очереди
      if (options?.isInQueue && options?.leaveQueue) {
        try {
          await options.leaveQueue();
          // Небольшая задержка для обработки выхода из очереди на сервере
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (queueError) {
          // Логируем ошибку выхода из очереди, но продолжаем выход из системы
          logger.warn('Ошибка при выходе из очереди:', queueError);
          toast.warning('Не удалось корректно выйти из очереди, но выход из системы продолжается');
        }
      }

      // Отправляем запрос на выход из системы через authService с ensureMinDuration
      // TODO: Заменить на реальный API вызов
      const result = await mockLogout();

      // Проверяем результат запроса
      if (result.success) {
        // Если запрос выполнен успешно, перенаправляем на страницу логина
        setSuccess(true);
        toast.success('Выход выполнен успешно!');
        router.push('/auth/login');
      } else {
        // Обработка ошибки (в текущей mock версии не используется)
        const errorMessage = 'Ошибка при выходе из системы';

        setError(errorMessage);
        toast.error(errorMessage);
        if (process.env.NODE_ENV !== 'production') {
          logger.error('Ошибка при выходе из системы:', errorMessage);
        }
      }
    } catch (error) {
      // Обрабатываем непредвиденные ошибки (например, сетевые ошибки)
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Произошла непредвиденная ошибка при выходе из системы';

      setError(errorMessage);
      toast.error(errorMessage);
      if (process.env.NODE_ENV !== 'production') {
        logger.error('Непредвиденная ошибка при выходе из системы:', error);
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Метод для сброса ошибки конкретного поля
  const clearFieldError = (field: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };

      delete newErrors[field];

      return newErrors;
    });
  };

  return {
    logout,
    isLoggingOut,
    error,
    success,
    fieldErrors,
    clearFieldError,
  };
};
