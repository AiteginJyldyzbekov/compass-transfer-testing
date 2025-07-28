'use client';

import { notFound, useRouter } from 'next/navigation';
import { useState, useEffect, useLayoutEffect } from 'react';
import { FormProvider, type UseFormReturn } from 'react-hook-form';
import { usersApi } from '@shared/api/users';
import { Card, CardContent } from '@shared/ui/layout';
import { ChapterHeader } from '@shared/ui/layout/chapter-header';
import { FormSidebar } from '@shared/ui/layout/form-sidebar';
import { BasicDataSection, TerminalDataSection } from '@entities/users';
import { ActivityStatus } from '@entities/users/enums';
import type { GetTerminalDTO } from '@entities/users/interface';
import { TERMINAL_FORM_CHAPTERS } from '@entities/users/model/form-chapters/terminal-chapters';
import type { TerminalUpdateFormData } from '@entities/users/schemas/terminalUpdateSchema';
import { useTerminalEditFormLogic } from '@features/users/forms/edit/terminal-edit-form';

interface TerminalEditViewProps {
  userId: string;
}

interface TerminalEditFormViewProps {
  form: UseFormReturn<TerminalUpdateFormData>;
  isSubmitting: boolean;
  getChapterStatus: (chapterId: string) => 'complete' | 'warning' | 'error' | 'pending';
  getChapterErrors: (chapterId: string) => string[];
  onUpdate: () => void;
  handleChapterClick: (chapterId: string) => void;
  onBack: () => void;
}

export function TerminalEditView({ userId }: TerminalEditViewProps) {
  const router = useRouter();
  const [terminal, setTerminal] = useState<GetTerminalDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем данные терминала
  useEffect(() => {
    const loadTerminal = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const userData = await usersApi.getTerminal(userId);

        setTerminal(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadTerminal();
    }
  }, [userId]);

  // Всегда вызываем хук, но с условными данными
  const logic = useTerminalEditFormLogic({
    terminalId: userId,
    initialData: {
      fullName: '',
      email: '', // Это поле используется только в хуке, но не в схеме формы
      phoneNumber: '',
      avatarUrl: null,
      status: ActivityStatus.Active,
      locationId: null,
      profile: {
        terminalId: '',
        ipAddress: null,
        deviceModel: null,
        osVersion: null,
        appVersion: null,
        browserInfo: null,
        screenResolution: null,
        deviceIdentifier: null,
      },
    },
    onBack: () => router.push(`/users/terminal/${userId}`),
    onSuccess: () => router.push(`/users/terminal/${userId}`),
  });

  // Заполняем форму через useLayoutEffect с reset()
  useLayoutEffect(() => {
    if (terminal && logic.form) {
      // Заполняем только поля, которые есть в схеме TerminalUpdateFormData
      logic.form.reset({
        fullName: terminal.fullName || '',
        phoneNumber: terminal.phoneNumber || '',
        avatarUrl: terminal.avatarUrl || null,
        status: terminal.status || ActivityStatus.Active,
        locationId: terminal.locationId || null,
        profile: {
          terminalId: terminal.profile?.terminalId || '',
          ipAddress: terminal.profile?.ipAddress || null,
          deviceModel: terminal.profile?.deviceModel || null,
          osVersion: terminal.profile?.osVersion || null,
          appVersion: terminal.profile?.appVersion || null,
          browserInfo: terminal.profile?.browserInfo || null,
          screenResolution: terminal.profile?.screenResolution || null,
          deviceIdentifier: terminal.profile?.deviceIdentifier || null,
        },
      });
    }
  }, [terminal, logic.form]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4' />
          <p>Загрузка данных терминала...</p>
        </div>
      </div>
    );
  }

  if (error || !terminal) {
    notFound();
  }

  return <TerminalEditFormView {...logic} />;
}

function TerminalEditFormView({
  form,
  isSubmitting,
  getChapterStatus,
  getChapterErrors,
  onUpdate,
  handleChapterClick,
  onBack,
}: TerminalEditFormViewProps) {
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

                {/* Глава 2: Данные терминала */}
                <div id='chapter-terminal' className='relative flex flex-col gap-4'>
                  <ChapterHeader
                    number={2}
                    title='Данные терминала'
                    status={getChapterStatus('terminal')}
                  />
                  <div className='relative ml-12'>
                    {/* Вертикальная линия */}
                    <div className='absolute -left-8 top-0 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300' />
                    <TerminalDataSection />
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className='w-80 flex-shrink-0 flex flex-col h-full'>
          {/* Сайдбар */}
          <FormSidebar
            chapters={TERMINAL_FORM_CHAPTERS.EDIT}
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
