'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { servicesApi } from '@shared/api/services';
import { logger } from '@shared/lib';
import {
  getBasicServiceDataStatus,
  getBasicServiceDataErrors,
} from '@entities/services/model/validation/ui';
import {
  serviceCreateSchema,
  type ServiceCreateFormData,
} from '@entities/services/schemas/serviceCreateSchema';

type ApiError = {
  detail?: string;
  errors?: Record<string, string[]>;
};

export function useServiceFormLogic({
  onBack,
  onSuccess,
}: {
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ServiceCreateFormData>({
    resolver: zodResolver(serviceCreateSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      description: '',
      price: undefined,
      isQuantifiable: false,
    },
  });

  const {
    formState: { errors, isSubmitted },
    handleSubmit,
    watch,
    trigger,
    setFocus,
  } = form;

  const formData = watch();

  const onSubmit = useCallback(
    async (data: ServiceCreateFormData) => {
      setIsSubmitting(true);
      try {
        // Подготавливаем данные для API
        const apiData = {
          name: data.name,
          description: data.description || null,
          price: data.price,
          isQuantifiable: data.isQuantifiable,
        };

        const result = await servicesApi.createService(apiData);

        if (result && result.name) {
          toast.success(`Услуга "${result.name}" успешно создана!`);
        } else {
          toast.success('Услуга успешно создана!');
        }
        onSuccess();
      } catch (error) {
        logger.warn('Ошибка создания услуги:', error);

        if (error instanceof Error && 'response' in error) {
          const axiosError = error as AxiosError<ApiError>;

          if (axiosError.response?.data?.errors) {
            const serverErrors = axiosError.response.data.errors;

            Object.keys(serverErrors).forEach(field => {
              const fieldKey = field as keyof ServiceCreateFormData;

              if (serverErrors[field] && serverErrors[field].length > 0) {
                form.setError(fieldKey, {
                  type: 'server',
                  message: serverErrors[field][0],
                });
              }
            });
            toast.error('Исправьте ошибки в форме');
          } else {
            toast.error(axiosError.response?.data?.detail || 'Ошибка создания услуги');
          }
        } else {
          toast.error('Неизвестная ошибка при создании услуги');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, onSuccess],
  );

  const getChapterStatus = useMemo(() => {
    return (chapterId: string): 'complete' | 'warning' | 'error' | 'pending' => {
      if (chapterId === 'basic') {
        return getBasicServiceDataStatus(formData, errors, isSubmitted);
      }

      return 'pending';
    };
  }, [formData, errors, isSubmitted]);

  const getChapterErrors = useMemo(() => {
    return (chapterId: string): string[] => {
      if (chapterId === 'basic') {
        return getBasicServiceDataErrors(formData, errors, isSubmitted);
      }

      return [];
    };
  }, [formData, errors, isSubmitted]);

  const onCreate = useCallback(async () => {
    const isValid = await trigger();

    if (!isValid) {
      const firstErrorField = Object.keys(form.formState.errors)[0];

      if (firstErrorField) {
        setFocus(firstErrorField as keyof ServiceCreateFormData);
      }

      return;
    }
    await handleSubmit(onSubmit)();
  }, [trigger, handleSubmit, onSubmit, form.formState.errors, setFocus]);

  const handleChapterClick = useCallback((chapterId: string) => {
    const element = document.getElementById(`chapter-${chapterId}`);

    if (element) {
      const yOffset = -20;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  return {
    form,
    isSubmitting,
    getChapterStatus,
    getChapterErrors,
    onCreate,
    handleChapterClick,
    onBack,
  };
}
