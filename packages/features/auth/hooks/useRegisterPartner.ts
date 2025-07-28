'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { logger } from '@shared/lib';
import type { PartnerRegisterFormData } from '@entities/auth';

// Mock функция для регистрации партнера
const mockRegisterPartner = async (data: PartnerRegisterFormData) => {
  // Имитируем задержку сети
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Простая проверка для демонстрации
  if (data.email === 'existing@example.com') {
    return {
      success: false,
      error: 'Email уже используется',
    };
  }

  return { success: true };
};

// Mock функция для автоматического входа
const mockAutoLogin = async (email: string, password: string) => {
  // Имитируем задержку сети
  await new Promise(resolve => setTimeout(resolve, 500));

  // Простая проверка
  if (email && password) {
    return { success: true };
  }

  return {
    success: false,
    error: 'Ошибка автоматического входа',
  };
};

interface UseRegisterPartnerResult {
  registerPartner: (data: PartnerRegisterFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  fieldErrors: Record<string, boolean>; // Информация о полях с ошибками
  clearFieldError: (field: string) => void; // Метод для сброса ошибки конкретного поля
}

/**
 * Хук для обработки логики регистрации партнера
 */
export const useRegisterPartner = (): UseRegisterPartnerResult => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  // Функция для автоматического входа после успешной регистрации
  const autoLogin = async (email: string, password: string): Promise<void> => {
    if (process.env.NODE_ENV !== 'production') {
      logger.info('Выполняется автоматический вход после регистрации...');
    }

    // Отправляем запрос на авторизацию через authService
    // TODO: Заменить на реальный API вызов
    const loginResult = await mockAutoLogin(email, password);

    if (!loginResult.success) {
      logger.error('Ошибка при автоматическом входе:', loginResult.error);
      // В случае ошибки перенаправляем на страницу входа
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 2000);
    } else {
      // Успешный вход, перенаправляем на главную страницу
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
  };

  const registerPartner = async (data: PartnerRegisterFormData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setFieldErrors({}); // Сбрасываем ошибки полей

    // Отправляем запрос на регистрацию партнера через authService
    // TODO: Заменить на реальный API вызов
    const result = await mockRegisterPartner(data);

    // Проверяем результат запроса
    if (!result.success) {
      const errorMessage = result.error || 'Произошла ошибка при регистрации';

      // Проверяем специфичные ошибки для установки field errors
      if (errorMessage.includes('Email') && errorMessage.includes('уже используется')) {
        setFieldErrors(prev => ({ ...prev, email: true }));
      }

      // Устанавливаем сообщение об ошибке и показываем toast
      setError(errorMessage);
      toast.error(errorMessage);

      if (process.env.NODE_ENV !== 'production') {
        logger.error('Ошибка регистрации:', errorMessage);
      }
    } else {
      // Успешная регистрация, автоматический вход после успешной регистрации
      setSuccess(true);
      toast.success('Регистрация успешно завершена! Перенаправление на страницу входа...');
      await autoLogin(data.email, data.password);
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

  return { registerPartner, isLoading, error, success, fieldErrors, clearFieldError };
};
