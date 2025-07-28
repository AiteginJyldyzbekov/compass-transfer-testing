'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/forms/select';
import { RadioGroup, RadioGroupItem } from '@shared/ui/forms/radio-group';
import { cn } from '@shared/lib/utils';
import type { InstantOrderCreateFormData } from '../schemas/orderCreateSchema';

interface OrderBasicSectionProps {
  showOptionalWarning?: boolean;
  labels?: {
    tariffId?: string;
    routeType?: string;
    routeId?: string;
    startLocationId?: string;
    endLocationId?: string;
    initialPrice?: string;
  };
  placeholders?: {
    routeId?: string;
    startLocationId?: string;
    endLocationId?: string;
    initialPrice?: string;
  };
  // Данные для селектов (должны приходить из родительского компонента)
  tariffs?: Array<{ id: string; name: string }>;
  routes?: Array<{ id: string; name: string }>;
  locations?: Array<{ id: string; name: string }>;
}

export function OrderBasicSection({
  showOptionalWarning = false,
  labels = {},
  placeholders = {},
  tariffs = [],
  routes = [],
  locations = [],
}: OrderBasicSectionProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<InstantOrderCreateFormData>();

  const tariffId = watch('tariffId');
  const routeType = watch('routeType');
  const routeId = watch('routeId');
  const startLocationId = watch('startLocationId');
  const endLocationId = watch('endLocationId');

  return (
    <div className="space-y-6">
      {/* Выбор тарифа */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {labels.tariffId || 'Тариф *'}
        </Label>
        <Select
          value={tariffId}
          onValueChange={(value) => setValue('tariffId', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите тариф" />
          </SelectTrigger>
          <SelectContent>
            {tariffs.map((tariff) => (
              <SelectItem key={tariff.id} value={tariff.id}>
                {tariff.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.tariffId && (
          <p className="text-sm text-red-600">{errors.tariffId.message}</p>
        )}
      </div>

      {/* Тип маршрута */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          {labels.routeType || 'Тип маршрута *'}
        </Label>
        <RadioGroup
          value={routeType}
          onValueChange={(value) => {
            setValue('routeType', value as 'template' | 'manual');
            // Очищаем поля при смене типа
            if (value === 'template') {
              setValue('startLocationId', '');
              setValue('endLocationId', '');
            } else {
              setValue('routeId', '');
            }
          }}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="template" id="template" />
            <Label htmlFor="template" className="text-sm font-normal cursor-pointer">
              Готовый маршрут
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="manual" id="manual" />
            <Label htmlFor="manual" className="text-sm font-normal cursor-pointer">
              Ручной выбор точек
            </Label>
          </div>
        </RadioGroup>
        {errors.routeType && (
          <p className="text-sm text-red-600">{errors.routeType.message}</p>
        )}
      </div>

      {/* Готовый маршрут */}
      {routeType === 'template' && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {labels.routeId || 'Готовый маршрут *'}
          </Label>
          <Select
            value={routeId}
            onValueChange={(value) => setValue('routeId', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите готовый маршрут" />
            </SelectTrigger>
            <SelectContent>
              {routes.map((route) => (
                <SelectItem key={route.id} value={route.id}>
                  {route.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.routeId && (
            <p className="text-sm text-red-600">{errors.routeId.message}</p>
          )}
        </div>
      )}

      {/* Ручной выбор точек */}
      {routeType === 'manual' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {labels.startLocationId || 'Начальная точка *'}
            </Label>
            <Select
              value={startLocationId}
              onValueChange={(value) => setValue('startLocationId', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите начальную точку" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.startLocationId && (
              <p className="text-sm text-red-600">{errors.startLocationId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {labels.endLocationId || 'Конечная точка *'}
            </Label>
            <Select
              value={endLocationId}
              onValueChange={(value) => setValue('endLocationId', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите конечную точку" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.endLocationId && (
              <p className="text-sm text-red-600">{errors.endLocationId.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Стоимость */}
      <div className="space-y-2">
        <Label htmlFor="initialPrice" className="text-sm font-medium">
          {labels.initialPrice || 'Предварительная стоимость *'}
        </Label>
        <Input
          id="initialPrice"
          type="number"
          min="0"
          step="0.01"
          placeholder={placeholders.initialPrice || '0.00'}
          className="w-full"
          {...register('initialPrice', {
            valueAsNumber: true,
            setValueAs: (value) => value === '' ? undefined : parseFloat(value)
          })}
        />
        {errors.initialPrice && (
          <p className="text-sm text-red-600">{errors.initialPrice.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Стоимость в сомах
        </p>
      </div>

      {showOptionalWarning && (
        <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Внимание
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Некоторые поля не заполнены, но это не критично для создания заказа.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
