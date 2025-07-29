'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import type { TariffCreateFormData } from '../schemas/tariffCreateSchema';

interface TariffPricingSectionProps {
  labels?: {
    basePrice?: string;
    minutePrice?: string;
    perKmPrice?: string;
    freeWaitingTimeMinutes?: string;
  };
  placeholders?: {
    basePrice?: string;
    minutePrice?: string;
    perKmPrice?: string;
    freeWaitingTimeMinutes?: string;
  };
}

export function TariffPricingSection({
  labels = {},
  placeholders = {},
}: TariffPricingSectionProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<TariffCreateFormData>();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Ценообразование</h3>
      
      {/* Базовая цена */}
      <div className="space-y-2">
        <Label htmlFor="basePrice" className="text-sm font-medium">
          {labels.basePrice || 'Базовая цена (сом) *'}
        </Label>
        <Input
          id="basePrice"
          type="number"
          min="0"
          step="0.01"
          placeholder={placeholders.basePrice || '50.00'}
          className="w-full"
          {...register('basePrice', {
            valueAsNumber: true,
            setValueAs: (value) => {
              if (value === '' || value === null || value === undefined) return undefined;
              const parsed = parseFloat(value);
              return isNaN(parsed) ? undefined : parsed;
            }
          })}
        />
        {errors.basePrice && (
          <p className="text-sm text-red-600">{errors.basePrice.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Стоимость подачи автомобиля
        </p>
      </div>

      {/* Цена за минуту */}
      <div className="space-y-2">
        <Label htmlFor="minutePrice" className="text-sm font-medium">
          {labels.minutePrice || 'Цена за минуту (сом) *'}
        </Label>
        <Input
          id="minutePrice"
          type="number"
          min="0"
          step="0.01"
          placeholder={placeholders.minutePrice || '5.00'}
          className="w-full"
          {...register('minutePrice', {
            valueAsNumber: true,
            setValueAs: (value) => {
              if (value === '' || value === null || value === undefined) return undefined;
              const parsed = parseFloat(value);
              return isNaN(parsed) ? undefined : parsed;
            }
          })}
        />
        {errors.minutePrice && (
          <p className="text-sm text-red-600">{errors.minutePrice.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Стоимость одной минуты поездки
        </p>
      </div>

      {/* Скрытое поле для минимальной цены */}
      <input
        type="hidden"
        {...register('minimumPrice', {
          valueAsNumber: true,
          setValueAs: () => 0 // Всегда возвращаем 0
        })}
        value={0}
      />

      {/* Цена за километр */}
      <div className="space-y-2">
        <Label htmlFor="perKmPrice" className="text-sm font-medium">
          {labels.perKmPrice || 'Цена за километр (сом) *'}
        </Label>
        <Input
          id="perKmPrice"
          type="number"
          min="0"
          step="0.01"
          placeholder={placeholders.perKmPrice || '15.00'}
          className="w-full"
          {...register('perKmPrice', {
            valueAsNumber: true,
            setValueAs: (value) => {
              if (value === '' || value === null || value === undefined) return undefined;
              const parsed = parseFloat(value);
              return isNaN(parsed) ? undefined : parsed;
            }
          })}
        />
        {errors.perKmPrice && (
          <p className="text-sm text-red-600">{errors.perKmPrice.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Стоимость одного километра поездки
        </p>
      </div>

      {/* Время бесплатного ожидания */}
      <div className="space-y-2">
        <Label htmlFor="freeWaitingTimeMinutes" className="text-sm font-medium">
          {labels.freeWaitingTimeMinutes || 'Бесплатное ожидание (минуты) *'}
        </Label>
        <Input
          id="freeWaitingTimeMinutes"
          type="number"
          min="0"
          max="60"
          step="1"
          placeholder={placeholders.freeWaitingTimeMinutes || '5'}
          className="w-full"
          {...register('freeWaitingTimeMinutes', {
            valueAsNumber: true,
            setValueAs: (value) => {
              if (value === '' || value === null || value === undefined) return undefined;
              const parsed = parseInt(value);
              return isNaN(parsed) ? undefined : parsed;
            }
          })}
        />
        {errors.freeWaitingTimeMinutes && (
          <p className="text-sm text-red-600">{errors.freeWaitingTimeMinutes.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Количество минут бесплатного ожидания водителя
        </p>
      </div>
    </div>
  );
}
