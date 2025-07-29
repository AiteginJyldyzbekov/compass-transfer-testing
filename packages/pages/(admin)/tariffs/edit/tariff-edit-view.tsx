'use client';

import { notFound, useRouter } from 'next/navigation';
import { useState, useEffect, useLayoutEffect } from 'react';
import { FormProvider, type UseFormReturn } from 'react-hook-form';
import { tariffsApi } from '@shared/api/tariffs';
import { Card, CardContent } from '@shared/ui/layout';
import { ChapterHeader } from '@shared/ui/layout/chapter-header';
import { FormSidebar } from '@shared/ui/layout/form-sidebar';
import { TariffBasicSection, TariffPricingSection } from '@entities/tariffs';
import type { TariffDTO } from '@entities/tariffs/interface';
import { TARIFF_FORM_CHAPTERS } from '@entities/tariffs/model/form-chapters/tariff-chapters';
import type { TariffUpdateFormData } from '@entities/tariffs/schemas/tariffUpdateSchema';
import { useTariffEditFormLogic } from '@features/tariffs/forms/edit/tariff-edit-form';

interface TariffEditViewProps {
  tariffId: string;
}

interface TariffEditFormViewProps {
  form: UseFormReturn<TariffUpdateFormData>;
  isSubmitting: boolean;
  getChapterStatus: (chapterId: string) => 'complete' | 'warning' | 'error' | 'pending';
  getChapterErrors: (chapterId: string) => string[];
  onUpdate: () => void;
  handleChapterClick: (chapterId: string) => void;
  onBack: () => void;
}

export function TariffEditView({ tariffId }: TariffEditViewProps) {
  const router = useRouter();
  const [tariff, setTariff] = useState<TariffDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем данные тарифа
  useEffect(() => {
    const loadTariff = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const tariffData = await tariffsApi.getTariffById(tariffId);

        setTariff(tariffData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
      } finally {
        setIsLoading(false);
      }
    };

    if (tariffId) {
      loadTariff();
    }
  }, [tariffId]);

  // Всегда вызываем хук, но с условными данными
  const logic = useTariffEditFormLogic({
    tariffId: tariffId,
    initialData: {
      name: '',
      serviceClass: 'Economy' as any,
      carType: 'Sedan' as any,
      basePrice: 0,
      minutePrice: 0,
      minimumPrice: 0, // Всегда 0
      perKmPrice: 0,
      freeWaitingTimeMinutes: 0,
    },
    onBack: () => router.push('/tariffs'),
    onSuccess: () => router.push('/tariffs'),
  });

  // Заполняем форму через useLayoutEffect с reset()
  useLayoutEffect(() => {
    if (tariff && logic.form) {
      logic.form.reset({
        name: tariff.name || '',
        serviceClass: tariff.serviceClass,
        carType: tariff.carType,
        basePrice: tariff.basePrice || 0,
        minutePrice: tariff.minutePrice || 0,
        minimumPrice: 0, // Всегда 0, игнорируем значение из API
        perKmPrice: tariff.perKmPrice || 0,
        freeWaitingTimeMinutes: tariff.freeWaitingTimeMinutes || 0,
      });
    }
  }, [tariff, logic.form]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4' />
          <p>Загрузка данных тарифа...</p>
        </div>
      </div>
    );
  }

  if (error || !tariff) {
    notFound();
  }

  return <TariffEditFormView {...logic} />;
}

function TariffEditFormView({
  form,
  isSubmitting,
  getChapterStatus,
  getChapterErrors,
  onUpdate,
  handleChapterClick,
  onBack,
}: TariffEditFormViewProps) {
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
                    <TariffBasicSection
                      showOptionalWarning={getChapterStatus('basic') === 'warning'}
                      labels={{
                        name: 'Название тарифа *',
                        serviceClass: 'Класс обслуживания *',
                        carType: 'Тип автомобиля *',
                      }}
                    />
                  </div>
                </div>

                {/* Глава 2: Ценообразование */}
                <div id='chapter-pricing' className='relative flex flex-col gap-4'>
                  <ChapterHeader
                    number={2}
                    title='Ценообразование'
                    status={getChapterStatus('pricing')}
                  />
                  <div className='relative ml-12'>
                    {/* Вертикальная линия */}
                    <div className='absolute -left-8 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300' />
                    <TariffPricingSection
                      labels={{
                        basePrice: 'Базовая цена (сом) *',
                        minutePrice: 'Цена за минуту (сом) *',
                        minimumPrice: 'Минимальная цена (сом) *',
                        perKmPrice: 'Цена за километр (сом) *',
                        freeWaitingTimeMinutes: 'Бесплатное ожидание (минуты) *',
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
            chapters={TARIFF_FORM_CHAPTERS.EDIT}
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
