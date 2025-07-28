'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { notificationsApi } from '@shared/api/notifications';
import { logger } from '@shared/lib';
import { NotificationType } from '@entities/notifications/enums/NotificationType.enum';
import {
  getBasicNotificationDataStatusForUpdate,
  getRelationsNotificationDataStatusForUpdate,
  getBasicNotificationDataErrorsForUpdate,
  getRelationsNotificationDataErrorsForUpdate,
} from '@entities/notifications/model/validation/ui';
import {
  notificationUpdateSchema,
  type NotificationUpdateFormData,
} from '@entities/notifications/schemas/notificationUpdateSchema';

type ApiError = {
  detail?: string;
  errors?: Record<string, string[]>;
};

export function useNotificationEditFormLogic({
  notificationId,
  initialData,
  onBack,
  onSuccess,
}: {
  notificationId: string;
  initialData: {
    type: NotificationType;
    title: string;
    content?: string | null;
    orderId?: string | null;
    rideId?: string | null;
    orderType?: string;
    isRead: boolean;
  };
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(notificationUpdateSchema),
    mode: 'onSubmit',
    defaultValues: {
      type: initialData.type,
      title: initialData.title,
      content: initialData.content || '',
      orderId: initialData.orderId || '',
      rideId: initialData.rideId || '',
      orderType: initialData.orderType || 'Unknown',
      isRead: initialData.isRead,
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
    async (data: NotificationUpdateFormData) => {
      setIsSubmitting(true);
      try {
        const apiData = {
          type: data.type,
          title: data.title,
          content: data.content || undefined,
          orderId: data.orderId || undefined,
          rideId: data.rideId || undefined,
          orderType: data.orderType || undefined,
          isRead: data.isRead,
        };
        
        const result = await notificationsApi.updateNotification(notificationId, apiData);

        if (result && result.title) {
          toast.success(`Уведомление "${result.title}" успешно обновлено!`);
        } else {
          toast.success('Уведомление успешно обновлено!');
        }
        onSuccess();
      } catch (error) {
        logger.warn('Ошибка обновления уведомления:', error);
        if (error instanceof Error && 'response' in error) {
          const axiosError = error as AxiosError<ApiError>;

          if (axiosError.response?.data?.errors) {
            const serverErrors = axiosError.response.data.errors;

            Object.keys(serverErrors).forEach(field => {
              const fieldKey = field as keyof NotificationUpdateFormData;

              if (serverErrors[field] && serverErrors[field].length > 0) {
                form.setError(fieldKey, {
                  type: 'server',
                  message: serverErrors[field][0],
                });
              }
            });
            toast.error('Исправьте ошибки в форме');
          } else {
            toast.error(axiosError.response?.data?.detail || 'Ошибка обновления уведомления');
          }
        } else {
          toast.error('Неизвестная ошибка при обновлении уведомления');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, onSuccess, notificationId],
  );

  const getChapterStatus = useMemo(() => {
    return (chapterId: string): 'complete' | 'warning' | 'error' | 'pending' => {
      if (chapterId === 'basic') {
        return getBasicNotificationDataStatusForUpdate(formData, errors, isSubmitted);
      }
      if (chapterId === 'relations') {
        return getRelationsNotificationDataStatusForUpdate(formData, errors, isSubmitted);
      }

      return 'pending';
    };
  }, [formData, errors, isSubmitted]);

  const getChapterErrors = useMemo(() => {
    return (chapterId: string): string[] => {
      if (chapterId === 'basic') {
        return getBasicNotificationDataErrorsForUpdate(formData, errors, isSubmitted);
      }
      if (chapterId === 'relations') {
        return getRelationsNotificationDataErrorsForUpdate(formData, errors, isSubmitted);
      }

      return [];
    };
  }, [formData, errors, isSubmitted]);

  const onUpdate = useCallback(async () => {
    const isValid = await trigger();

    if (!isValid) {
      const firstErrorField = Object.keys(form.formState.errors)[0];

      if (firstErrorField) {
        setFocus(firstErrorField as keyof NotificationUpdateFormData);
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
