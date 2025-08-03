'use client';

import { Calendar as CalendarIcon, Plane, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Calendar } from '@shared/ui/data-display/calendar';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Textarea } from '@shared/ui/forms/textarea';
import { Card, CardContent } from '@shared/ui/layout/card';

interface ScheduleTabProps {
  onScheduleChange?: (scheduledTime: string) => void;
  onValidityChange?: (isValid: boolean) => void; // Новый колбэк для валидности времени
  initialScheduledTime?: string;
  methods?: {
    setValue: (name: string, value: unknown) => void;
    getValues: (name?: string) => unknown;
    [key: string]: unknown;
  }; // React Hook Form methods
}

export function ScheduleTab({ onScheduleChange, onValidityChange, initialScheduledTime, methods }: ScheduleTabProps) {
  // Функция для получения дефолтного времени
  const getInitialTime = () => {
    const now = new Date();
    const minAllowedTime = new Date(now.getTime() + 10 * 60 * 1000); // +10 минут

    // Округляем до ближайших 5 минут вверх
    const minutes = Math.ceil(minAllowedTime.getMinutes() / 5) * 5;
    let hours = minAllowedTime.getHours();

    if (minutes >= 60) {
      hours += 1;
      return { hour: hours, minute: 0 };
    }

    return { hour: hours, minute: minutes };
  };

  // Инициализируем состояния с учетом initialScheduledTime
  const getInitialValues = () => {
    if (initialScheduledTime) {
      const dateTime = new Date(initialScheduledTime);
      const timeString = `${dateTime.getHours().toString().padStart(2, '0')}:${dateTime.getMinutes().toString().padStart(2, '0')}`;

      return {
        date: dateTime,
        hour: dateTime.getHours(),
        minute: dateTime.getMinutes(),
        time: timeString,
      };
    } else {
      const defaultTime = getInitialTime();
      const timeString = `${defaultTime.hour.toString().padStart(2, '0')}:${defaultTime.minute.toString().padStart(2, '0')}`;

      return {
        date: new Date(),
        hour: defaultTime.hour,
        minute: defaultTime.minute,
        time: timeString,
      };
    }
  };

  const initialValues = getInitialValues();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialValues.date);
  const [selectedTime, setSelectedTime] = useState<string | null>(initialValues.time);
  const [selectedHour, setSelectedHour] = useState<number>(initialValues.hour);
  const [selectedMinute, setSelectedMinute] = useState<number>(initialValues.minute);

  // Используем значения из основной формы
  const flyReis = (methods?.getValues('flyReis') as string) || '';
  const airFlight = (methods?.getValues('airFlight') as string) || '';
  const description = (methods?.getValues('description') as string) || '';

  // Убираем useEffect отсюда - переместим после определения updateScheduledTime

  // Заблокированные даты (пример - можно оставить для будущих бронирований)
  const bookedDates = Array.from({ length: 3 }, (_, i) => new Date(2025, 0, 17 + i));

  // Функция для проверки, заблокировано ли время
  const isTimeDisabled = (hour: number, minute: number): boolean => {
    if (!selectedDate) return false;

    const now = new Date();
    const minAllowedTime = new Date(now.getTime() + 10 * 60 * 1000); // +10 минут
    const selectedDateTime = new Date(selectedDate);
    selectedDateTime.setHours(hour, minute, 0, 0);

    // Если выбранная дата - сегодня, проверяем время
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(selectedDate);
    checkDate.setHours(0, 0, 0, 0);

    if (checkDate.getTime() === today.getTime() && selectedDateTime < minAllowedTime) {
      return true; // Время в прошлом для сегодняшнего дня
    }

    return false;
  };

  // Кастомная функция для выбора даты, которая не сбрасывает выбор
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);

      // Если выбрана дата в будущем и текущее время заблокировано, сбрасываем время на 12:00
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);

      if (checkDate.getTime() > today.getTime() && isTimeDisabled(selectedHour, selectedMinute)) {
        setSelectedHour(12);
        setSelectedMinute(0);
        const timeString = '12:00';
        setSelectedTime(timeString);
        updateScheduledTime(date, timeString);
      } else {
        updateScheduledTime(date, selectedTime);
      }
    }
    // Не сбрасываем дату если date undefined (клик вне календаря)
  };

  // Функция для обновления поля scheduledTime в форме
  const updateScheduledTime = (date: Date | undefined, time: string | null) => {
    if (onScheduleChange && date && time) {
      // Создаем datetime-local строку в формате YYYY-MM-DDTHH:MM
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const scheduledTimeString = `${year}-${month}-${day}T${time}`;

      // Проверяем, что выбранное время не в прошлом
      const selectedDateTime = new Date(scheduledTimeString);
      const now = new Date();
      const minAllowedTime = new Date(now.getTime() + 5 * 60 * 1000); // +5 минут от текущего времени

      if (selectedDateTime < minAllowedTime) {
        toast.error('Время в прошлом', {
          description: 'Выберите время минимум через 5 минут от текущего времени'
        });

        // Уведомляем родительский компонент о невалидности
        if (onValidityChange) {
          onValidityChange(false);
        }

        return;
      }

      // Уведомляем родительский компонент о валидности
      if (onValidityChange) {
        onValidityChange(true);
      }

      onScheduleChange(scheduledTimeString);
    } else {
      // Очищаем поле если дата или время не выбраны
      if (onScheduleChange) {
        onScheduleChange('');
      }

      // Уведомляем о невалидности если нет даты или времени
      if (onValidityChange) {
        onValidityChange(false);
      }
    }
  };

  // Проверяем валидность при первоначальной загрузке и изменениях
  useEffect(() => {
    updateScheduledTime(selectedDate, selectedTime);
  }, [selectedDate, selectedTime]); // Не включаем updateScheduledTime чтобы избежать бесконечного цикла

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
                // Новые пропсы для времени
                showTimePicker={!!selectedDate}
                selectedHour={selectedHour}
                selectedMinute={selectedMinute}
                isTimeDisabled={isTimeDisabled}
                onTimeChange={(hour, minute) => {
                  // Валидация теперь происходит на уровне UI через isTimeDisabled
                  setSelectedHour(hour);
                  setSelectedMinute(minute);
                  const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

                  setSelectedTime(timeString);
                  updateScheduledTime(selectedDate, timeString);
                }}
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
