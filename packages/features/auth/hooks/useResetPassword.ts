'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { logger } from '@shared/lib';
import type { ResetPasswordFormData } from '@entities/auth';

// Mock функция для сброса пароля
const mockResetPassword = async (data: ResetPasswordFormData) => {
  // Имитируем задержку сети
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Простая проверка для демонстрации
  if (data.resetCode === '123456' && data.newPassword.length >= 8) {
    return { success: true };
  }

  if (data.resetCode !== '123456') {
    return {
      success: false,
      error: 'Неверный код сброса или код истек',
    };
  }

  if (data.newPassword.length < 8) {
    return {
      success: false,
      error: 'Пароль слишком короткий',
    };
  }

  return {
    success: false,
    error: 'Произошла ошибка при сбросе пароля',
  };
};

interface UseResetPasswordResult {
  resetPassword: (data: ResetPasswordFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  fieldErrors: Record<string, boolean>; // Информация о полях с ошибками
  clearFieldError: (field: string) => void; // Метод для сброса ошибки конкретного поля
}

/**
 * Хук для обработки логики сброса пароля
 */
export const useResetPassword = (): UseResetPasswordResult => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  const resetPassword = async (data: ResetPasswordFormData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setFieldErrors({}); // Сбрасываем ошибки полей

    // Отправляем запрос на сброс пароля через authService
    // TODO: Заменить на реальный API вызов
    const result = await mockResetPassword(data);

    // Проверяем результат запроса
    if (!result.success) {
      const errorMessage = result.error || 'Произошла ошибка при сбросе пароля';

      // Проверяем специфичные ошибки для установки field errors
      if (errorMessage.includes('неверный код') || errorMessage.includes('истек')) {
        setFieldErrors(prev => ({ ...prev, resetCode: true }));
      } else if (errorMessage.includes('не найден')) {
        setFieldErrors(prev => ({ ...prev, email: true }));
      } else if (errorMessage.includes('слишком короткий')) {
        setFieldErrors(prev => ({ ...prev, newPassword: true }));
      }

      // Устанавливаем сообщение об ошибке и показываем toast
      setError(errorMessage);
      toast.error(errorMessage);

      if (process.env.NODE_ENV !== 'production') {
        logger.error('Ошибка сброса пароля:', errorMessage);
      }
    } else {
      // Успешный сброс пароля, перенаправляем на страницу входа через 2 секунды
      setSuccess(true);
      toast.success('Пароль успешно изменен! Вы будете перенаправлены на страницу входа.');
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    }

    setIsLoading(false);
  };

  // Метод для сброса ошибки конкретного поля
  const clearFieldError = (field: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };

      delete newErrors[field];

      return newErrors;
    });
  };

  return { resetPassword, isLoading, error, success, fieldErrors, clearFieldError };
};
