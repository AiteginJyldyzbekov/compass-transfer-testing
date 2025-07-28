'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { AuthService } from '@shared/api/auth-service';
import { logger } from '@shared/lib';
import type {
  ChangePasswordDTO,
  ChangePasswordResponse,
} from '@entities/auth/interface/ChangePasswordDTO';
import type { ChangePasswordFormData } from '@entities/auth/schemas/change-password';

interface UseChangePasswordResult {
  changePassword: (data: ChangePasswordFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
  fieldErrors: Record<string, boolean>;
  clearFieldError: (field: string) => void;
}

/**
 * Хук для смены пароля
 */
export const useChangePassword = (): UseChangePasswordResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

  const changePassword = async (data: ChangePasswordFormData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setFieldErrors({});

    try {
      // Подготавливаем данные для API
      const apiData: ChangePasswordDTO = {
        newEmail: null, // Не меняем email
        newPassword: data.newPassword,
        oldPassword: data.oldPassword,
      };

      // Отправляем запрос на смену пароля через AuthService
      const apiResponse = await AuthService.changePassword(apiData);

      // Обрабатываем ответ API
      // Если нет ошибки и есть данные, значит пароль изменен успешно
      const result: ChangePasswordResponse =
        !apiResponse.error && apiResponse.data
          ? { success: true }
          : {
              success: false,
              error: apiResponse.error?.message || 'Произошла ошибка при смене пароля',
            };

      if (result.success) {
        setSuccess(true);
        toast.success('Пароль успешно изменен!');
      } else {
        const errorMessage = result.error || 'Произошла ошибка при смене пароля';

        setError(errorMessage);

        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }

        toast.error(errorMessage);

        if (process.env.NODE_ENV !== 'production') {
          logger.error('Ошибка смены пароля:', errorMessage);
        }
      }
    } catch (error) {
      let errorMessage = 'Произошла непредвиденная ошибка при смене пароля';

      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = String(error.message);
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      setError(errorMessage);
      toast.error(errorMessage);

      if (process.env.NODE_ENV !== 'production') {
        logger.error('Непредвиденная ошибка смены пароля:', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearFieldError = (field: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };

      delete newErrors[field];

      return newErrors;
    });
  };

  return {
    changePassword,
    isLoading,
    error,
    success,
    fieldErrors,
    clearFieldError,
  };
};
