'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { locationsApi } from '@shared/api/locations';
import { logger } from '@shared/lib';
import { LocationType } from '@entities/locations/enums';
import type { LocationDTO } from '@entities/locations/interface';
import {
  getBasicLocationDataStatusForUpdate,
  getCoordinatesLocationDataStatusForUpdate,
  getBasicLocationDataErrorsForUpdate,
  getCoordinatesLocationDataErrorsForUpdate,
} from '@entities/locations/model/validation/ui';
import {
  locationUpdateSchema,
  type LocationUpdateFormData,
} from '@entities/locations/schemas/locationUpdateSchema';

type ApiError = {
  detail?: string;
  errors?: Record<string, string[]>;
};

export function useLocationEditFormLogic({
  locationId,
  initialData,
  onBack,
  onSuccess,
}: {
  locationId: string;
  initialData: {
    name: string;
    description?: string | null;
    type: LocationType;
    address: string;
    latitude: number;
    longitude: number;
    isActive: boolean;
    popular: boolean;
    popular2: boolean;
  };
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(locationUpdateSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: initialData.name,
      description: initialData.description || '',
      type: initialData.type,
      address: initialData.address,
      latitude: initialData.latitude,
      longitude: initialData.longitude,
      isActive: initialData.isActive,
      popular: initialData.popular,
      popular2: initialData.popular2,
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
    async (data: LocationUpdateFormData) => {
      setIsSubmitting(true);
      try {
        const apiData = {
          name: data.name,
          description: data.description || null,
          type: data.type,
          address: data.address,
          city: 'Бишкек', // Временно захардкодим
          country: 'Кыргызстан', // Временно захардкодим
          region: 'Чуйская область', // Временно захардкодим
          latitude: data.latitude,
          longitude: data.longitude,
          isActive: data.isActive,
          popular1: data.popular,
          popular2: data.popular2,
        };
        
        const result = await locationsApi.updateLocation(locationId, apiData);

        if (result && result.name) {
          toast.success(`Локация "${result.name}" успешно обновлена!`);
        } else {
          toast.success('Локация успешно обновлена!');
        }
        onSuccess();
      } catch (error) {
        logger.warn('Ошибка обновления локации:', error);
        if (error instanceof Error && 'response' in error) {
          const axiosError = error as AxiosError<ApiError>;

          if (axiosError.response?.data?.errors) {
            const serverErrors = axiosError.response.data.errors;

            Object.keys(serverErrors).forEach(field => {
              const fieldKey = field as keyof LocationUpdateFormData;

              if (serverErrors[field] && serverErrors[field].length > 0) {
                form.setError(fieldKey, {
                  type: 'server',
                  message: serverErrors[field][0],
                });
              }
            });
            toast.error('Исправьте ошибки в форме');
          } else {
            toast.error(axiosError.response?.data?.detail || 'Ошибка обновления локации');
          }
        } else {
          toast.error('Неизвестная ошибка при обновлении локации');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, onSuccess, locationId],
  );

  const getChapterStatus = useMemo(() => {
    return (chapterId: string): 'complete' | 'warning' | 'error' | 'pending' => {
      if (chapterId === 'basic') {
        return getBasicLocationDataStatusForUpdate(formData, errors, isSubmitted);
      }
      if (chapterId === 'coordinates') {
        return getCoordinatesLocationDataStatusForUpdate(formData, errors, isSubmitted);
      }

      return 'pending';
    };
  }, [formData, errors, isSubmitted]);

  const getChapterErrors = useMemo(() => {
    return (chapterId: string): string[] => {
      if (chapterId === 'basic') {
        return getBasicLocationDataErrorsForUpdate(formData, errors, isSubmitted);
      }
      if (chapterId === 'coordinates') {
        return getCoordinatesLocationDataErrorsForUpdate(formData, errors, isSubmitted);
      }

      return [];
    };
  }, [formData, errors, isSubmitted]);

  const onUpdate = useCallback(async () => {
    const isValid = await trigger();

    if (!isValid) {
      const firstErrorField = Object.keys(form.formState.errors)[0];

      if (firstErrorField) {
        setFocus(firstErrorField as keyof LocationUpdateFormData);
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
