'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { AuthService } from '@shared/api/auth-service';
import { logger } from '@shared/lib';
import type { PartnerRegisterFormData } from '@entities/auth';



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



  const registerPartner = async (data: PartnerRegisterFormData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setFieldErrors({}); // Сбрасываем ошибки полей

    try {
      // Отправляем запрос на регистрацию партнера через authService
      const result = await AuthService.registerPartner({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        companyName: data.companyName,
        legalAddress: data.legalAddress,
      });

      // Проверяем результат запроса
      if (result.error) {
        const errorMessage = result.error.message || 'Произошла ошибка при регистрации';

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
      } else if (result.data) {
        // Успешная регистрация
        setSuccess(true);
        toast.success(result.data.message || 'Регистрация успешно завершена!');

        // Перенаправляем на страницу входа
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      logger.error('Ошибка регистрации партнера:', err);
      setError('Произошла ошибка при регистрации');
      toast.error('Произошла ошибка при регистрации');
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
