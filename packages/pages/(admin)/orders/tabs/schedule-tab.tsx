'use client';

import { Calendar as CalendarIcon, Plane, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Calendar } from '@shared/ui/data-display/calendar';
import { Button } from '@shared/ui/forms/button';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Textarea } from '@shared/ui/forms/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@shared/ui/layout/card';

interface ScheduleTabProps {
  onScheduleChange?: (scheduledTime: string) => void;
  initialScheduledTime?: string;
  methods?: {
    setValue: (name: string, value: unknown) => void;
    getValues: (name?: string) => unknown;
    [key: string]: unknown;
  }; // React Hook Form methods
}

export function ScheduleTab({ onScheduleChange, initialScheduledTime, methods }: ScheduleTabProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Используем значения из основной формы
  const flyReis = (methods?.getValues('flyReis') as string) || '';
  const airFlight = (methods?.getValues('airFlight') as string) || '';
  const description = (methods?.getValues('description') as string) || '';

  // Генерируем временные слоты 24 часа с интервалом 15 минут
  const allTimeSlots = Array.from({ length: 96 }, (_, i) => {
    const totalMinutes = i * 15;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;

    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
  });

  // Фильтруем временные слоты с учетом резерва 10 минут
  const getAvailableTimeSlots = () => {
    if (!selectedDate) return allTimeSlots;

    const today = new Date();
    const selectedDateOnly = new Date(selectedDate);

    selectedDateOnly.setHours(0, 0, 0, 0);

    const todayOnly = new Date(today);

    todayOnly.setHours(0, 0, 0, 0);

    // Если выбранная дата не сегодня, возвращаем все слоты
    if (selectedDateOnly.getTime() !== todayOnly.getTime()) {
      return allTimeSlots;
    }

    // Если сегодня, фильтруем слоты с резервом 10 минут
    const minTime = new Date();

    minTime.setMinutes(minTime.getMinutes() + 10);
    const minHour = minTime.getHours();
    const minMinute = minTime.getMinutes();

    return allTimeSlots.filter(slot => {
      const [hour, minute] = slot.split(':').map(Number);
      const slotTime = hour * 60 + minute;
      const minTimeInMinutes = minHour * 60 + minMinute;

      return slotTime >= minTimeInMinutes;
    });
  };

  const timeSlots = getAvailableTimeSlots();

  // Минимальная дата - сегодня + 10 минут резерва
  const minDateTime = new Date();

  minDateTime.setMinutes(minDateTime.getMinutes() + 10);

  // Заблокированные даты (пример - можно оставить для будущих бронирований)
  const bookedDates = Array.from(
    { length: 3 },
    (_, i) => new Date(2025, 0, 17 + i)
  );



  // Кастомная функция для выбора даты, которая не сбрасывает выбор
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      updateScheduledTime(date, selectedTime);
    }
    // Не сбрасываем дату если date undefined (клик вне календаря)
  };

  // Функция для обновления времени
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    updateScheduledTime(selectedDate, time);
  };

  // Функция для обновления поля scheduledTime в форме
  const updateScheduledTime = (date: Date | undefined, time: string | null) => {
    if (onScheduleChange && date && time) {
      // Создаем datetime-local строку в формате YYYY-MM-DDTHH:MM
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const scheduledTimeString = `${year}-${month}-${day}T${time}`;

      onScheduleChange(scheduledTimeString);
    } else if (onScheduleChange) {
      // Очищаем поле если дата или время не выбраны
      onScheduleChange('');
    }
  };

  // Инициализация значений из пропсов при загрузке
  useEffect(() => {
    if (initialScheduledTime) {
      // Парсим datetime-local строку
      const dateTime = new Date(initialScheduledTime);

      setSelectedDate(dateTime);

      const hours = String(dateTime.getHours()).padStart(2, '0');
      const minutes = String(dateTime.getMinutes()).padStart(2, '0');
      const timeString = `${hours}:${minutes}`;

      setSelectedTime(timeString);
    }
  }, [initialScheduledTime]);



  return (
    <div className="space-y-6 h-full">
      <div className="flex flex-col lg:flex-row gap-0 h-full">
        {/* Информация о рейсе слева */}
        <div className="flex-[1]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Информация о рейсах
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Рейс вылета */}
                <div className="space-y-2">
                  <Label htmlFor="air-flight" className="flex items-center gap-2">
                    Рейс вылета
                  </Label>
                  <Input
                    id="air-flight"
                    placeholder="Например: SU 1234 (только буквы, цифры, пробелы, дефисы)"
                    value={airFlight}
                    onChange={(e) => {
                      // Преобразуем в верхний регистр и оставляем только разрешенные символы
                      const cleanValue = e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9\s-]/g, ''); // Удаляем недопустимые символы

                      if (methods) {
                        methods.setValue('airFlight', cleanValue);
                      }
                    }}
                  />
                </div>

                {/* Рейс прилета */}
                <div className="space-y-2">
                  <Label htmlFor="fly-reis" className="flex items-center gap-2">
                    Рейс прилета
                  </Label>
                  <Input
                    id="fly-reis"
                    placeholder="Например: SU 5678 (только буквы, цифры, пробелы, дефисы)"
                    value={flyReis}
                    onChange={(e) => {
                      // Преобразуем в верхний регистр и оставляем только разрешенные символы
                      const cleanValue = e.target.value
                        .toUpperCase()
                        .replace(/[^A-Z0-9\s-]/g, ''); // Удаляем недопустимые символы

                      if (methods) {
                        methods.setValue('flyReis', cleanValue);
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Дополнительные заметки на всю ширину */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Заметки к поездке
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="description">Дополнительная информация</Label>
            <Textarea
              id="description"
              placeholder="Добавьте заметки о поездке, особые требования или комментарии..."
              value={description}
              onChange={(e) => {
                if (methods) {
                  methods.setValue('description', e.target.value);
                }
              }}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t px-6 py-5 md:flex-row">
            <div className="text-md min-w-0 flex-1">
              {selectedDate && selectedTime ? (
                <>
                  Поездка запланирована на{" "}
                  <span className="font-medium whitespace-nowrap">
                    {selectedDate?.toLocaleDateString("ru-RU", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  {" "}в <span className="font-medium">{selectedTime}</span>.
                </>
              ) : (
                <>Выберите дату и время для поездки.</>
              )}
            </div>
          </CardFooter>
      </Card>
        </div>

        {/* Календарь с выбором времени справа */}
        <div className="flex-[1]">
        <Card className="gap-0 p-0 h-full w-full">
          <CardContent className="relative p-0 flex flex-row">
            <div className="p-6 w-full">
              <div className="mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Выбор даты и времени поездки
                </h3>
                <p className="text-sm text-muted-foreground">
                  Выберите дату в календаре и время отправления
                </p>
              </div>
              <Calendar
                key={selectedDate?.toISOString() || 'no-date'}
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                defaultMonth={selectedDate}
                disabled={(date) => {
                  // Блокируем прошлые даты
                  const today = new Date();

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
                  booked: "[&>button]:line-through opacity-100",
                }}
                className="bg-transparent p-0 [&_.rdp-day]:text-base [&_.rdp-day]:font-medium"
                formatters={{
                  formatWeekdayName: (date) => {
                    return date.toLocaleString("ru-RU", { weekday: "short" });
                  },
                }}
              />
            </div>
            <div className="h-full right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:max-h-none md:border-t-0 md:border-l">
              <div className="space-y-2 w-full">
                <div className='sticky top-0 bg-white'>
                  <h4 className="font-medium text-sm mb-2">Время отправления</h4>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => handleTimeSelect(time)}
                      className="w-full shadow-none text-xs"
                      size="sm"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
