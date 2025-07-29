'use client';

import { useFormContext } from 'react-hook-form';
import { Label } from '@shared/ui/forms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/forms/select';
import { cn } from '@shared/lib/utils';
import { locationTypeHelpers } from '../helpers/location-type-helpers';
import { LocationType } from '../enums';
import type { LocationCreateFormData } from '../schemas/locationCreateSchema';

interface LocationBasicSectionProps {
  labels?: {
    type?: string;
  };
}

export function LocationBasicSection({
  labels = {},
}: LocationBasicSectionProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<LocationCreateFormData>();

  const formData = watch();

  return (
    <div className="space-y-6">
      {/* Скрытое поле для регистрации в форме */}
      <input type="hidden" {...register('type')} />

      {/* Описание */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Описание
        </Label>
        <textarea
          id="description"
          {...register('description')}
          placeholder="Введите описание локации (необязательно)"
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 no-ring resize-none"
          )}
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {/* Тип локации */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {labels.type || 'Тип локации *'}
        </Label>
        <Select
          value={locationTypeHelpers.getSafeValue(formData.type)}
          onValueChange={(value: string) => {
            setValue('type', value as LocationType, { shouldValidate: true, shouldDirty: true });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите тип локации" />
          </SelectTrigger>
          <SelectContent>
            {locationTypeHelpers.getOptions().map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>
    </div>
  );
}
