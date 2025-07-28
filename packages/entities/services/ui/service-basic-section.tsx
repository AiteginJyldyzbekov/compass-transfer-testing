'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Checkbox } from '@shared/ui/forms/checkbox';
import { cn } from '@shared/lib/utils';
import type { ServiceCreateFormData } from '@entities/services/schemas/serviceCreateSchema';

interface ServiceBasicSectionProps {
  showOptionalWarning?: boolean;
  labels?: {
    name?: string;
    description?: string;
    price?: string;
    isQuantifiable?: string;
  };
  placeholders?: {
    name?: string;
    description?: string;
    price?: string;
  };
}

export function ServiceBasicSection({
  showOptionalWarning = false,
  labels = {},
  placeholders = {},
}: ServiceBasicSectionProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<ServiceCreateFormData>();

  const isQuantifiable = watch('isQuantifiable');

  return (
    <div className="space-y-6">
      {/* Название услуги */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          {labels.name || 'Название услуги *'}
        </Label>
        <Input
          id="name"
          {...register('name')}
          placeholder={placeholders.name || 'Введите название услуги'}
          className="w-full"
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Описание услуги */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          {labels.description || 'Описание услуги'}
        </Label>
        <textarea
          id="description"
          {...register('description')}
          placeholder={placeholders.description || 'Введите описание услуги (необязательно)'}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 no-ring resize-none"
          )}
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Цена услуги */}
      <div className="space-y-2">
        <Label htmlFor="price" className="text-sm font-medium">
          {labels.price || 'Цена услуги (сом) *'}
        </Label>
        <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          placeholder={placeholders.price || '0.00'}
          className="w-full"
          {...register('price', {
            valueAsNumber: true,
            setValueAs: (value) => value === '' ? undefined : parseFloat(value)
          })}
        />
        {errors.price && (
          <p className="text-sm text-red-600">{errors.price.message}</p>
        )}
      </div>

      {/* Можно ли указать количество */}
      <div className="flex flex-row items-center space-x-3 rounded-lg border p-4">
        <Checkbox
          id="isQuantifiable"
          checked={isQuantifiable}
          onCheckedChange={(checked) => setValue('isQuantifiable', checked)}
        />
        <div className="flex-1 space-y-0.5">
          <Label htmlFor="isQuantifiable" className="text-sm font-medium cursor-pointer">
            {labels.isQuantifiable || 'Можно указать количество'}
          </Label>
          <div className="text-sm text-muted-foreground">
            Позволяет клиентам указывать количество единиц данной услуги
          </div>
          {errors.isQuantifiable && (
            <p className="text-sm text-red-600">{errors.isQuantifiable.message}</p>
          )}
        </div>
      </div>

      {showOptionalWarning && (
        <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Внимание
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Некоторые поля не заполнены, но это не критично для создания услуги.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
