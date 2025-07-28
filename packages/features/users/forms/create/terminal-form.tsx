'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { usersApi } from '@shared/api/users';
import { logger } from '@shared/lib';
import { ActivityStatus } from '@entities/users/enums';
import type { CreateTerminalDTO } from '@entities/users/interface/CreateTerminalDTO';
import {
  getBasicDataStatus,
  getBasicDataErrors,
  getSecurityStatus,
  getSecurityErrors,
  getTerminalDataStatus,
  getTerminalDataErrors,
} from '@entities/users/model/validation/ui';
import {
  terminalCreateSchema,
  type TerminalCreateFormData,
} from '@entities/users/schemas/terminalCreateSchema';

type ApiError = {
  detail?: string;
  errors?: Record<string, string[]>;
};

export function useTerminalFormLogic({
  selectedRole,
  onBack,
  onSuccess,
}: {
  selectedRole: string;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TerminalCreateFormData>({
    resolver: zodResolver(terminalCreateSchema),
    mode: 'onSubmit',
    defaultValues: {
      phoneNumber: '',
      fullName: '',
      avatarUrl: null,
      status: ActivityStatus.Active,
      locationId: '',
      profile: {
        terminalId: '',
        ipAddress: '',
        deviceModel: '',
        osVersion: '',
        appVersion: '',
        browserInfo: '',
        screenResolution: '',
        deviceIdentifier: '',
      },
      email: '',
      password: '',
      confirmPassword: '',
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

  const getChapterStatus = useMemo(() => {
    return (chapterId: string): 'complete' | 'warning' | 'error' | 'pending' => {
      if (chapterId === 'basic') {
        return getBasicDataStatus(formData, errors, isSubmitted);
      }
      if (chapterId === 'terminal') {
        return getTerminalDataStatus(formData.profile, errors, isSubmitted);
      }
      if (chapterId === 'security') {
        return getSecurityStatus(formData, errors, isSubmitted);
      }

      return 'pending';
    };
  }, [formData, errors, isSubmitted]);

  const getChapterErrors = useMemo(() => {
    return (chapterId: string): string[] => {
      if (chapterId === 'basic') {
        return getBasicDataErrors(formData, errors, isSubmitted);
      }
      if (chapterId === 'terminal') {
        return getTerminalDataErrors(formData.profile, errors, isSubmitted);
      }
      if (chapterId === 'security') {
        return getSecurityErrors(formData, errors, isSubmitted);
      }

      return [];
    };
  }, [formData, errors, isSubmitted]);

  const onSubmit = useCallback(
    async (data: TerminalCreateFormData) => {
      setIsSubmitting(true);
      try {
        // Подготавливаем данные для API (исключаем confirmPassword)
        const { confirmPassword: _confirmPassword, ...formDataWithoutConfirm } = data;
        const apiData: CreateTerminalDTO = {
          ...formDataWithoutConfirm,
          phoneNumber: data.phoneNumber || null,
          locationId: data.locationId || null,
          avatarUrl: data.avatarUrl || null,
          status: data.status,
        };
        const result = await usersApi.createTerminal(apiData);

        if (result && result.fullName) {
          toast.success(`Терминал ${result.fullName} успешно создан!`);
        } else {
          toast.success('Терминал успешно создан!');
        }
        onSuccess();
      } catch (error) {
        logger.warn('Ошибка создания терминала:', error);
        if (error instanceof Error && 'response' in error) {
          const axiosError = error as AxiosError<ApiError>;

          const data = axiosError.response?.data;

          if (data && typeof data === 'object' && 'errors' in data && data.errors) {
            const serverErrors = data.errors;

            Object.keys(serverErrors).forEach(field => {
              const fieldKey = field as keyof TerminalCreateFormData;

              if (serverErrors[field] && serverErrors[field].length > 0) {
                form.setError(fieldKey, {
                  type: 'server',
                  message: serverErrors[field][0],
                });
              }
            });
            toast.error('Исправьте ошибки в форме');
          } else if (data && typeof data === 'object' && 'detail' in data) {
            toast.error((data as ApiError).detail || 'Ошибка создания терминала');
          } else {
            toast.error('Ошибка создания терминала');
          }
        } else {
          toast.error('Неизвестная ошибка при создании терминала');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, onSuccess],
  );

  const onCreate = useCallback(async () => {
    const isValid = await trigger();

    if (!isValid) {
      const firstErrorField = Object.keys(form.formState.errors)[0];

      if (firstErrorField) {
        setFocus(firstErrorField as keyof TerminalCreateFormData);
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
    selectedRole,
  };
}
