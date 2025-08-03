'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useState, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { usersApi } from '@shared/api/users';
import { logger } from '@shared/lib';
import { VerificationStatus, BusinessType } from '@entities/users/enums';
import type { CreatePartnerDTO } from '@entities/users/interface/CreatePartnerDTO';
import {
  getBasicDataStatus,
  getBasicDataErrors,
  getCompanyDataStatus,
  getCompanyDataErrors,
  getSecurityStatus,
  getSecurityErrors,
} from '@entities/users/model/validation/ui';
import {
  partnerCreateSchema,
  type PartnerCreateFormData,
} from '@entities/users/schemas/partnerCreateSchema';

type ApiError = {
  detail?: string;
  errors?: Record<string, string[]>;
};

export function usePartnerFormLogic({
  selectedRole,
  onBack,
  onSuccess,
}: {
  selectedRole: string;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PartnerCreateFormData>({
    resolver: zodResolver(partnerCreateSchema),
    mode: 'onSubmit',
    defaultValues: {
      phoneNumber: '',
      fullName: '',
      avatarUrl: null,
      verificationStatus: VerificationStatus.Pending,
      profile: {
        companyName: '',
        companyType: BusinessType.LLC,
        registrationNumber: '',
        taxIdentifier: '',
        legalAddress: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
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
      if (chapterId === 'business') {
        return getCompanyDataStatus(formData.profile, errors, isSubmitted);
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
      if (chapterId === 'business') {
        return getCompanyDataErrors(formData.profile, errors, isSubmitted);
      }
      if (chapterId === 'security') {
        return getSecurityErrors(formData, errors, isSubmitted);
      }

      return [];
    };
  }, [formData, errors, isSubmitted]);

  const onSubmit = useCallback(
    async (data: PartnerCreateFormData) => {
      setIsSubmitting(true);
      try {
        // Подготавливаем данные для API (исключаем confirmPassword)
        const { confirmPassword: _confirmPassword, ...formDataWithoutConfirm } = data;
        const apiData: CreatePartnerDTO = {
          ...formDataWithoutConfirm,
          phoneNumber: data.phoneNumber || null,
          avatarUrl: data.avatarUrl || null,
          verificationStatus: data.verificationStatus,
          profile: {
            ...data.profile,
            companyType: data.profile.companyType,
          },
        };
        const result = await usersApi.createPartner(apiData);

        if (result && result.fullName) {
          toast.success(`Контр-агент ${result.fullName} успешно создан!`);
        } else {
          toast.success('Контр-агент успешно создан!');
        }
        onSuccess();
      } catch (error) {
        if (error instanceof Error && 'response' in error) {
          const axiosError = error as AxiosError<ApiError>;

          if (axiosError.response?.data?.errors) {
            const serverErrors = axiosError.response.data.errors;

            Object.keys(serverErrors).forEach(field => {
              const fieldKey = field as keyof PartnerCreateFormData;

              if (serverErrors[field] && serverErrors[field].length > 0) {
                form.setError(fieldKey, {
                  type: 'server',
                  message: serverErrors[field][0],
                });
              }
            });
            toast.error('Исправьте ошибки в форме');
          } else {
            toast.error(axiosError.response?.data?.detail || 'Ошибка создания партнера');
          }
        } else {
          toast.error('Неизвестная ошибка при создании партнера');
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
        setFocus(firstErrorField as keyof PartnerCreateFormData);
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
