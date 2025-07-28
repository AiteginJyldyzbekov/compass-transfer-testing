'use client';

import { notFound, useRouter } from 'next/navigation';
import { useState, useEffect, useLayoutEffect } from 'react';
import { FormProvider, type UseFormReturn } from 'react-hook-form';
import { usersApi } from '@shared/api/users';
import { Card, CardContent } from '@shared/ui/layout';
import { ChapterHeader } from '@shared/ui/layout/chapter-header';
import { FormSidebar } from '@shared/ui/layout/form-sidebar';
import { BasicDataSection } from '@entities/users';
import type { GetCustomerDTO } from '@entities/users/interface';
import { CUSTOMER_FORM_CHAPTERS } from '@entities/users/model/form-chapters/customer-chapters';
import type { CustomerUpdateFormData } from '@entities/users/schemas/customerUpdateSchema';
import { useCustomerEditFormLogic } from '@features/users/forms/edit/customer-edit-form';

interface CustomerEditViewProps {
  userId: string;
}

interface CustomerEditFormViewProps {
  form: UseFormReturn<CustomerUpdateFormData>;
  isSubmitting: boolean;
  getChapterStatus: (chapterId: string) => 'complete' | 'warning' | 'error' | 'pending';
  getChapterErrors: (chapterId: string) => string[];
  onUpdate: () => void;
  handleChapterClick: (chapterId: string) => void;
  onBack: () => void;
}

export function CustomerEditView({ userId }: CustomerEditViewProps) {
  const router = useRouter();
  const [customer, setCustomer] = useState<GetCustomerDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем данные клиента
  useEffect(() => {
    const loadCustomer = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const userData = await usersApi.getCustomer(userId);

        setCustomer(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadCustomer();
    }
  }, [userId]);

  // Всегда вызываем хук, но с условными данными
  const logic = useCustomerEditFormLogic({
    customerId: userId,
    initialData: {
      fullName: '',
      email: '', // Это поле используется только в хуке, но не в схеме формы
      phoneNumber: '',
      avatarUrl: null,
      loyaltyPoints: 0,
    },
    onBack: () => router.push(`/users/customer/${userId}`),
    onSuccess: () => router.push(`/users/customer/${userId}`),
  });

  // Заполняем форму через useLayoutEffect с reset()
  useLayoutEffect(() => {
    if (customer && logic.form) {
      // Заполняем только поля, которые есть в схеме CustomerUpdateFormData
      logic.form.reset({
        fullName: customer.fullName || '',
        phoneNumber: customer.phoneNumber || '',
        avatarUrl: customer.avatarUrl || null,
        loyaltyPoints: customer.loyaltyPoints || 0,
      });
    }
  }, [customer, logic.form]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4' />
          <p>Загрузка данных клиента...</p>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    notFound();
  }

  return <CustomerEditFormView {...logic} />;
}

function CustomerEditFormView({
  form,
  isSubmitting,
  getChapterStatus,
  getChapterErrors,
  onUpdate,
  handleChapterClick,
  onBack,
}: CustomerEditFormViewProps) {
  return (
    <FormProvider {...form}>
      <div className='flex overflow-hidden h-full pb-2'>
        <div className='shadow-md flex-1 h-full p-4 overflow-auto border bg-white rounded-2xl md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-[0_10px_40px_rgba(255,255,255,0.3)]'>
          <Card className='h-full flex flex-col overflow-auto pr-4'>
            <CardContent className='p-0'>
              <form className='flex flex-col gap-4'>
                {/* Глава 1: Базовые данные */}
                <div id='chapter-basic' className='relative flex flex-col gap-4'>
                  <ChapterHeader
                    number={1}
                    title='Базовые данные'
                    status={getChapterStatus('basic')}
                  />
                  <div className='relative ml-12'>
                    {/* Вертикальная линия */}
                    <div className='absolute -left-8 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300' />
                    <BasicDataSection
                      showOptionalPhoneWarning={getChapterStatus('basic') === 'warning'}
                      showEmail={false}
                      labels={{
                        fullName: 'Полное имя *',
                        phoneNumber: 'Телефон',
                      }}
                    />
                  </div>
                </div>

                {/* Глава 2: Баллы лояльности */}
                <div id='chapter-loyalty' className='relative flex flex-col gap-4'>
                  <ChapterHeader
                    number={2}
                    title='Баллы лояльности'
                    status={getChapterStatus('loyalty')}
                  />
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className='w-80 flex-shrink-0 flex flex-col h-full'>
          {/* Сайдбар */}
          <FormSidebar
            chapters={CUSTOMER_FORM_CHAPTERS.EDIT}
            getChapterStatus={getChapterStatus}
            getChapterErrors={getChapterErrors}
            onChapterClick={handleChapterClick}
            onUpdate={onUpdate}
            isSubmitting={isSubmitting}
            onBack={onBack}
          />
        </div>
      </div>
    </FormProvider>
  );
}
