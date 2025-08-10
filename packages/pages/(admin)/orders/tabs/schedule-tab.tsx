'use client';

import { Calendar as CalendarIcon, Plane, MapPin } from 'lucide-react';
import { Calendar } from '@shared/ui/data-display/calendar';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Textarea } from '@shared/ui/forms/textarea';
import { Card, CardContent } from '@shared/ui/layout/card';
import type { CreateScheduledOrderDTOType } from '@entities/orders/schemas';
import { useScheduleManagement } from '@features/orders/schedule';

interface ScheduleTabProps {
  onScheduleChange?: (scheduledTime: string) => void;
  onValidityChange?: (isValid: boolean) => void;
  initialScheduledTime?: string;
  methods?: {
    setValue: <K extends keyof CreateScheduledOrderDTOType>(name: K, value: CreateScheduledOrderDTOType[K]) => void;
    getValues: <K extends keyof CreateScheduledOrderDTOType>(name?: K) => K extends keyof CreateScheduledOrderDTOType ? CreateScheduledOrderDTOType[K] : Partial<CreateScheduledOrderDTOType>;
    [key: string]: unknown;
  };
}

export function ScheduleTab({ onScheduleChange, onValidityChange, initialScheduledTime, methods }: ScheduleTabProps) {
  const {
    selectedDate,
    selectedTime,
    selectedHour,
    selectedMinute,
    handleDateSelect,
    handleTimeChange,
    isTimeDisabled,
  } = useScheduleManagement({
    initialScheduledTime,
    onScheduleChange,
    onValidityChange
  });

  // Используем значения из основной формы
  const flyReis = (methods?.getValues('flyReis') as string) || '';
  const airFlight = (methods?.getValues('airFlight') as string) || '';
  const description = (methods?.getValues('description') as string) || '';

  // Заблокированные даты (пример - можно оставить для будущих бронирований)
  const bookedDates = Array.from({ length: 3 }, (_, i) => new Date(2025, 0, 17 + i));

  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex flex-row w-full gap-6'>
          {/* Информация о рейсах */}
          <div className='flex-[2] flex-col'>
            <div className='space-y-3'>
              <h3 className='font-medium flex items-center gap-2'>
                <Plane className='h-4 w-4 text-primary' />
                Рейсы
              </h3>
              <div className='space-y-3'>
                <div className='space-y-1'>
                  <Label htmlFor='air-flight' className='text-xs font-medium'>
                    Рейс вылета
                  </Label>
                  <Input
                    id='air-flight'
                    placeholder='SU 1234'
                    value={airFlight}
                    onChange={e => {
                      const cleanValue = e.target.value.toUpperCase().replace(/[^A-Z0-9\s-]/g, '');

                      if (methods) {
                        methods.setValue('airFlight', cleanValue);
                      }
                    }}
                    className='font-mono h-8 text-sm'
                  />
                </div>

                <div className='space-y-1'>
                  <Label htmlFor='fly-reis' className='text-xs font-medium'>
                    Рейс прилета
                  </Label>
                  <Input
                    id='fly-reis'
                    placeholder='SU 5678'
                    value={flyReis}
                    onChange={e => {
                      const cleanValue = e.target.value.toUpperCase().replace(/[^A-Z0-9\s-]/g, '');

                      if (methods) {
                        methods.setValue('flyReis', cleanValue);
                      }
                    }}
                    className='font-mono h-8 text-sm'
                  />
                </div>
                <div className='space-y-3'>
                  <h3 className='font-medium flex items-center gap-2'>
                    <MapPin className='h-4 w-4 text-primary' />
                    Заметки
                  </h3>
                  <div className='space-y-2'>
                    <Label htmlFor='description' className='text-xs font-medium'>
                      Комментарии
                    </Label>
                    <Textarea
                      id='description'
                      placeholder='Особые требования, номер терминала, встреча с табличкой...'
                      value={description}
                      onChange={e => {
                        if (methods) {
                          methods.setValue('description', e.target.value);
                        }
                      }}
                      rows={6}
                      className='resize-none text-sm'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Календарь */}
          <div className='flex-[1] flex-col gap-4'>
            <div className='space-y-3'>
              <h3 className='font-medium flex items-center gap-2'>
                <CalendarIcon className='h-4 w-4 text-primary' />
                Дата поездки
              </h3>
              <Calendar
                key={selectedDate?.toISOString() || 'no-date'}
                mode='single'
                selected={selectedDate}
                onSelect={handleDateSelect}
                defaultMonth={selectedDate}
                disabled={date => {
                  // Блокируем прошлые даты с резервом в 10 минут
                  const now = new Date();
                  const minAllowedTime = new Date(now.getTime() + 10 * 60 * 1000); // +10 минут
                  const today = new Date(minAllowedTime);

                  today.setHours(0, 0, 0, 0);
                  const checkDate = new Date(date);

                  checkDate.setHours(0, 0, 0, 0);

                  if (checkDate < today) {
                    return true; // Прошлые даты заблокированы
                  }

                  // Также блокируем заранее забронированные даты
                  return bookedDates.some(bookedDate => {
                    const bookedDateOnly = new Date(bookedDate);

                    bookedDateOnly.setHours(0, 0, 0, 0);

                    return bookedDateOnly.getTime() === checkDate.getTime();
                  });
                }}
                showOutsideDays={false}
                fixedWeeks
                modifiers={{
                  booked: bookedDates,
                }}
                modifiersClassNames={{
                  booked: '[&>button]:line-through opacity-50',
                }}
                className='origin-top-left p-0'
                formatters={{
                  formatWeekdayName: date => {
                    return date.toLocaleString('ru-RU', { weekday: 'short' });
                  },
                }}
                showTimePicker={!!selectedDate}
                selectedHour={selectedHour}
                selectedMinute={selectedMinute}
                isTimeDisabled={isTimeDisabled}
                onTimeChange={handleTimeChange}
              />
            </div>

            {/* Подтверждение выбора */}
            {selectedDate && selectedTime && (
              <div className=''>
                <div className='rounded-lg bg-primary/5 border border-primary/20 p-3'>
                  <div className='flex flex-col gap-2 text-sm'>
                    <div className='flex flex-row gap-2 items-center'>
                      <CalendarIcon className='h-4 w-4 text-primary' />
                      <span className='font-medium'>Поездка запланирована:</span>
                    </div>
                    <span className='text-muted-foreground'>
                      {selectedDate.toLocaleDateString('ru-RU', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}{' '}
                      в {selectedTime}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}