'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, User } from 'lucide-react';
import { Button } from '@shared/ui/forms/button';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Checkbox } from '@shared/ui/forms/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/forms/select';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout';
import type { InstantOrderCreateFormData } from '../schemas/orderCreateSchema';

interface OrderPassengersSectionProps {
  labels?: {
    passengers?: string;
  };
  // Данные клиентов для выбора
  customers?: Array<{ id: string; firstName: string; lastName?: string }>;
}

export function OrderPassengersSection({
  labels = {},
  customers = [],
}: OrderPassengersSectionProps) {
  const {
    control,
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<InstantOrderCreateFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'passengers',
  });

  const passengers = watch('passengers');

  const addPassenger = () => {
    append({
      customerId: '',
      firstName: '',
      lastName: '',
      isMainPassenger: passengers.length === 0, // Первый пассажир автоматически главный
    });
  };

  const removePassenger = (index: number) => {
    if (fields.length > 1) {
      remove(index);
      
      // Если удаляем главного пассажира, делаем главным первого оставшегося
      if (passengers[index]?.isMainPassenger && passengers.length > 1) {
        const remainingIndex = index === 0 ? 1 : 0;
        setValue(`passengers.${remainingIndex}.isMainPassenger`, true);
      }
    }
  };

  const setMainPassenger = (index: number) => {
    // Убираем флаг главного пассажира у всех
    passengers.forEach((_, i) => {
      setValue(`passengers.${i}.isMainPassenger`, i === index);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {labels.passengers || 'Пассажиры *'}
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPassenger}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Добавить пассажира
        </Button>
      </div>

      {errors.passengers && (
        <p className="text-sm text-red-600">{errors.passengers.message}</p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Пассажир {index + 1}
                  {passengers[index]?.isMainPassenger && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Главный
                    </span>
                  )}
                </CardTitle>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePassenger(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Выбор клиента */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Клиент</Label>
                <Select
                  value={passengers[index]?.customerId || ''}
                  onValueChange={(value) => {
                    setValue(`passengers.${index}.customerId`, value);
                    // Автоматически заполняем имя и фамилию из выбранного клиента
                    const customer = customers.find(c => c.id === value);
                    if (customer) {
                      setValue(`passengers.${index}.firstName`, customer.firstName);
                      setValue(`passengers.${index}.lastName`, customer.lastName || '');
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите клиента (необязательно)" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.firstName} {customer.lastName || ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.passengers?.[index]?.customerId && (
                  <p className="text-sm text-red-600">
                    {errors.passengers[index]?.customerId?.message}
                  </p>
                )}
              </div>

              {/* Имя и фамилия */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Имя *</Label>
                  <Input
                    {...register(`passengers.${index}.firstName`)}
                    placeholder="Введите имя пассажира"
                    className="w-full"
                  />
                  {errors.passengers?.[index]?.firstName && (
                    <p className="text-sm text-red-600">
                      {errors.passengers[index]?.firstName?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Фамилия</Label>
                  <Input
                    {...register(`passengers.${index}.lastName`)}
                    placeholder="Введите фамилию пассажира"
                    className="w-full"
                  />
                  {errors.passengers?.[index]?.lastName && (
                    <p className="text-sm text-red-600">
                      {errors.passengers[index]?.lastName?.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Главный пассажир */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`main-passenger-${index}`}
                  checked={passengers[index]?.isMainPassenger || false}
                  onCheckedChange={() => setMainPassenger(index)}
                />
                <Label
                  htmlFor={`main-passenger-${index}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  Главный пассажир
                </Label>
              </div>
              {errors.passengers?.[index]?.isMainPassenger && (
                <p className="text-sm text-red-600">
                  {errors.passengers[index]?.isMainPassenger?.message}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Пассажиры не добавлены</p>
          <Button
            type="button"
            variant="outline"
            onClick={addPassenger}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Добавить первого пассажира
          </Button>
        </div>
      )}

      <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Информация
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Должен быть указан ровно один главный пассажир. Остальные пассажиры считаются сопровождающими.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
