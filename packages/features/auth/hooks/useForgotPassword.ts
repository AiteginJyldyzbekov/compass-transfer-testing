'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { logger } from '@shared/lib';
import type { ForgotPasswordFormData } from '@entities/auth';

// Mock функция для восстановления пароля
const mockForgotPassword = async (data: ForgotPasswordFormData) => {
  // Имитируем задержку сети
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Простая проверка для демонстрации
  if (data.email && data.email.includes('@')) {
    return { success: true };
  }

  return {
    success: false,
    error: 'Пользователь с таким email не найден',
  };
};

interface UseForgotPasswordResult {
  forgotPassword: (data: ForgotPasswordFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  fieldErrors: Record<string, boolean>; // Информация о полях с ошибками
  clearFieldError: (field: string) => void; // Метод для сброса ошибки конкретного поля
}

/**
 * Хук для обработки логики восстановления пароля
 */
export const useForgotPassword = (): UseForgotPasswordResult => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  const forgotPassword = async (data: ForgotPasswordFormData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setFieldErrors({}); // Сбрасываем ошибки полей

    // Отправляем запрос на восстановление пароля через
    // TODO: Заменить на реальный API вызов
    const result = await mockForgotPassword(data);

    // Проверяем результат запроса
    if (!result.success) {
      const errorMessage = result.error || 'Произошла ошибка при отправке запроса';

      // Проверяем специфичные ошибки для установки field errors
      if (errorMessage.includes('не найден') || errorMessage.includes('некорректный email')) {
        setFieldErrors(prev => ({ ...prev, email: true }));
      }

      // Устанавливаем сообщение об ошибке и показываем toast
      setError(errorMessage);
      toast.error(errorMessage);

      if (process.env.NODE_ENV !== 'production') {
        logger.error('Ошибка восстановления пароля:', errorMessage);
      }
    } else {
      // Успешная отправка запроса, показываем уведомление о переходе на страницу сброса пароля
      setSuccess(true);
      toast.success('Инструкции по восстановлению пароля отправлены на указанный email.');
      toast.info('Переход на страницу сброса пароля...', { duration: 2000 });
      setTimeout(() => {
        router.push(`/auth/reset-password?email=${encodeURIComponent(data.email)}`);
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

  return { forgotPassword, isLoading, error, success, fieldErrors, clearFieldError };
};
