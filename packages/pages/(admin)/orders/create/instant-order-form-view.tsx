import { FormProvider, type UseFormReturn } from 'react-hook-form';
import { Button } from '@shared/ui/forms/button';
import { Card, CardContent } from '@shared/ui/layout';
import { ChapterHeader } from '@shared/ui/layout/chapter-header';
import { FormSidebar } from '@shared/ui/layout/form-sidebar';
import { OrderBasicSection, OrderPassengersSection } from '@entities/orders';
import { ORDER_FORM_CHAPTERS } from '@entities/orders/model/form-chapters/order-chapters';
import type { InstantOrderCreateFormData } from '@entities/orders/schemas/orderCreateSchema';

interface InstantOrderFormViewProps {
  form: UseFormReturn<InstantOrderCreateFormData>;
  isSubmitting: boolean;
  getChapterStatus: (chapterId: string) => 'complete' | 'warning' | 'error' | 'pending';
  getChapterErrors: (chapterId: string) => string[];
  onCreate: () => void;
  handleChapterClick: (chapterId: string) => void;
  onBack: () => void;
  // Данные для селектов
  tariffs?: Array<{ id: string; name: string }>;
  routes?: Array<{ id: string; name: string }>;
  locations?: Array<{ id: string; name: string }>;
  customers?: Array<{ id: string; firstName: string; lastName?: string }>;
}

export function InstantOrderFormView({
  form,
  isSubmitting,
  getChapterStatus,
  getChapterErrors,
  onCreate,
  handleChapterClick,
  onBack,
  tariffs = [],
  routes = [],
  locations = [],
  customers = [],
}: InstantOrderFormViewProps) {
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
                    <OrderBasicSection
                      showOptionalWarning={getChapterStatus('basic') === 'warning'}
                      labels={{
                        tariffId: 'Тариф *',
                        routeType: 'Тип маршрута *',
                        routeId: 'Готовый маршрут *',
                        startLocationId: 'Начальная точка *',
                        endLocationId: 'Конечная точка *',
                        initialPrice: 'Предварительная стоимость *',
                      }}
                      placeholders={{
                        initialPrice: '0.00',
                      }}
                      tariffs={tariffs}
                      routes={routes}
                      locations={locations}
                    />
                  </div>
                </div>

                {/* Глава 2: Пассажиры */}
                <div id='chapter-passengers' className='relative flex flex-col gap-4'>
                  <ChapterHeader
                    number={2}
                    title='Пассажиры'
                    status={getChapterStatus('passengers')}
                  />
                  <div className='relative ml-12'>
                    {/* Вертикальная линия */}
                    <div className='absolute -left-8 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300' />
                    <OrderPassengersSection
                      labels={{
                        passengers: 'Пассажиры *',
                      }}
                      customers={customers}
                    />
                  </div>
                </div>

                <div className='flex justify-end space-x-4 pt-6'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={onBack}
                    disabled={isSubmitting}
                    className='focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow'
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        <div className='w-80 flex-shrink-0 flex flex-col h-full'>
          <FormSidebar
            title='Создание мгновенного заказа'
            chapters={ORDER_FORM_CHAPTERS.CREATE_INSTANT}
            getChapterStatus={getChapterStatus}
            getChapterErrors={getChapterErrors}
            onCreate={onCreate}
            isSubmitting={isSubmitting}
            onBack={onBack}
            onChapterClick={handleChapterClick}
          />
        </div>
      </div>
    </FormProvider>
  );
}
