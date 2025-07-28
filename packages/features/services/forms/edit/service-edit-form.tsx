'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { servicesApi } from '@shared/api/services';
import { logger } from '@shared/lib';
import type { GetServiceDTO } from '@entities/services/interface';
import {
  getBasicServiceDataStatusForUpdate,
  getBasicServiceDataErrorsForUpdate,
} from '@entities/services/model/validation/ui';
import {
  serviceUpdateSchema,
  type ServiceUpdateFormData,
} from '@entities/services/schemas/serviceUpdateSchema';

type ApiError = {
  detail?: string;
  errors?: Record<string, string[]>;
};

export function useServiceEditFormLogic({
  serviceId,
  initialData,
  onBack,
  onSuccess,
}: {
  serviceId: string;
  initialData: {
    name: string;
    description?: string | null;
    price: number;
    isQuantifiable: boolean;
  };
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(serviceUpdateSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: initialData.name,
      description: initialData.description || '',
      price: initialData.price,
      isQuantifiable: initialData.isQuantifiable,
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
    async (data: ServiceUpdateFormData) => {
      setIsSubmitting(true);
      try {
        const apiData = {
          name: data.name,
          description: data.description || null,
          price: data.price,
          isQuantifiable: data.isQuantifiable,
        };
        
        const result = await servicesApi.updateService(serviceId, apiData);

        if (result && result.name) {
          toast.success(`Услуга "${result.name}" успешно обновлена!`);
        } else {
          toast.success('Услуга успешно обновлена!');
        }
        onSuccess();
      } catch (error) {
        logger.warn('Ошибка обновления услуги:', error);
        if (error instanceof Error && 'response' in error) {
          const axiosError = error as AxiosError<ApiError>;

          if (axiosError.response?.data?.errors) {
            const serverErrors = axiosError.response.data.errors;

            Object.keys(serverErrors).forEach(field => {
              const fieldKey = field as keyof ServiceUpdateFormData;

              if (serverErrors[field] && serverErrors[field].length > 0) {
                form.setError(fieldKey, {
                  type: 'server',
                  message: serverErrors[field][0],
                });
              }
            });
            toast.error('Исправьте ошибки в форме');
          } else {
            toast.error(axiosError.response?.data?.detail || 'Ошибка обновления услуги');
          }
        } else {
          toast.error('Неизвестная ошибка при обновлении услуги');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, onSuccess, serviceId],
  );

  const getChapterStatus = useMemo(() => {
    return (chapterId: string): 'complete' | 'warning' | 'error' | 'pending' => {
      if (chapterId === 'basic') {
        return getBasicServiceDataStatusForUpdate(formData, errors, isSubmitted);
      }

      return 'pending';
    };
  }, [formData, errors, isSubmitted]);

  const getChapterErrors = useMemo(() => {
    return (chapterId: string): string[] => {
      if (chapterId === 'basic') {
        return getBasicServiceDataErrorsForUpdate(formData, errors, isSubmitted);
      }

      return [];
    };
  }, [formData, errors, isSubmitted]);

  const onUpdate = useCallback(async () => {
    const isValid = await trigger();

    if (!isValid) {
      const firstErrorField = Object.keys(form.formState.errors)[0];

      if (firstErrorField) {
        setFocus(firstErrorField as keyof ServiceUpdateFormData);
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
    onUpdate,
    handleChapterClick,
    onBack,
  };
}
