'use client';

import { notFound, useRouter } from 'next/navigation';
import { useState, useEffect, useLayoutEffect } from 'react';
import { FormProvider, type UseFormReturn } from 'react-hook-form';
import { servicesApi } from '@shared/api/services';
import { Card, CardContent } from '@shared/ui/layout';
import { ChapterHeader } from '@shared/ui/layout/chapter-header';
import { FormSidebar } from '@shared/ui/layout/form-sidebar';
import { ServiceBasicSection } from '@entities/services';
import type { GetServiceDTO } from '@entities/services/interface';
import { SERVICE_FORM_CHAPTERS } from '@entities/services/model/form-chapters/service-chapters';
import type { ServiceUpdateFormData } from '@entities/services/schemas/serviceUpdateSchema';
import { useServiceEditFormLogic } from '@features/services/forms/edit/service-edit-form';

interface ServiceEditViewProps {
  serviceId: string;
}

interface ServiceEditFormViewProps {
  form: UseFormReturn<ServiceUpdateFormData>;
  isSubmitting: boolean;
  getChapterStatus: (chapterId: string) => 'complete' | 'warning' | 'error' | 'pending';
  getChapterErrors: (chapterId: string) => string[];
  onUpdate: () => void;
  handleChapterClick: (chapterId: string) => void;
  onBack: () => void;
}

export function ServiceEditView({ serviceId }: ServiceEditViewProps) {
  const router = useRouter();
  const [service, setService] = useState<GetServiceDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем данные услуги
  useEffect(() => {
    const loadService = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const serviceData = await servicesApi.getServiceById(serviceId);

        setService(serviceData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
      } finally {
        setIsLoading(false);
      }
    };

    if (serviceId) {
      loadService();
    }
  }, [serviceId]);

  // Всегда вызываем хук, но с условными данными
  const logic = useServiceEditFormLogic({
    serviceId: serviceId,
    initialData: {
      name: '',
      description: '',
      price: 0,
      isQuantifiable: false,
    },
    onBack: () => router.push('/services'),
    onSuccess: () => router.push('/services'),
  });

  // Заполняем форму через useLayoutEffect с reset()
  useLayoutEffect(() => {
    if (service && logic.form) {
      logic.form.reset({
        name: service.name || '',
        description: service.description || '',
        price: service.price || 0,
        isQuantifiable: service.isQuantifiable || false,
      });
    }
  }, [service, logic.form]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4' />
          <p>Загрузка данных услуги...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    notFound();
  }

  return <ServiceEditFormView {...logic} />;
}

function ServiceEditFormView({
  form,
  isSubmitting,
  getChapterStatus,
  getChapterErrors,
  onUpdate,
  handleChapterClick,
  onBack,
}: ServiceEditFormViewProps) {
  return (
    <FormProvider {...form}>
      <div className='flex overflow-hidden h-full pb-2'>
        <div className='shadow-md flex-1 h-full p-4 overflow-auto border bg-white rounded-2xl md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-[0_10px_40px_rgba(255,255,255,0.3)]'>
          <Card className='h-full flex flex-col overflow-auto pr-4'>
            <CardContent className='p-0'>
              <form className='flex flex-col gap-4'>
                {/* Глава 1: Основная информация */}
                <div id='chapter-basic' className='relative flex flex-col gap-4'>
                  <ChapterHeader
                    number={1}
                    title='Основная информация'
                    status={getChapterStatus('basic')}
                  />
                  <div className='relative ml-12'>
                    {/* Вертикальная линия */}
                    <div className='absolute -left-8 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300' />
                    <ServiceBasicSection
                      showOptionalWarning={getChapterStatus('basic') === 'warning'}
                      labels={{
                        name: 'Название услуги *',
                        description: 'Описание услуги',
                        price: 'Цена услуги (сом) *',
                        isQuantifiable: 'Можно указать количество',
                      }}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className='w-80 flex-shrink-0 flex flex-col h-full'>
          {/* Сайдбар */}
          <FormSidebar
            chapters={SERVICE_FORM_CHAPTERS.EDIT}
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
