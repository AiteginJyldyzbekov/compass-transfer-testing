'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/forms/select';
import { Checkbox } from '@shared/ui/forms/checkbox';
import { cn } from '@shared/lib/utils';
import { LocationType, LocationTypeLabels } from '../enums';
import type { LocationCreateFormData } from '../schemas/locationCreateSchema';

interface LocationBasicSectionProps {
  showOptionalWarning?: boolean;
  labels?: {
    name?: string;
    description?: string;
    type?: string;
    address?: string;
    isActive?: string;
    popular?: string;
    popular2?: string;
  };
  placeholders?: {
    name?: string;
    description?: string;
    address?: string;
  };
}

export function LocationBasicSection({
  showOptionalWarning = false,
  labels = {},
  placeholders = {},
}: LocationBasicSectionProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<LocationCreateFormData>();

  const type = watch('type');
  const isActive = watch('isActive');
  const popular = watch('popular');
  const popular2 = watch('popular2');

  return (
    <div className="space-y-6">
      {/* Название локации */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          {labels.name || 'Название локации *'}
        </Label>
        <Input
          id="name"
          {...register('name')}
          placeholder={placeholders.name || 'Введите название локации'}
          className="w-full"
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Описание локации */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          {labels.description || 'Описание локации'}
        </Label>
        <textarea
          id="description"
          {...register('description')}
          placeholder={placeholders.description || 'Введите описание локации (необязательно)'}
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
          value={type}
          onValueChange={(value) => setValue('type', value as LocationType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите тип локации" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(LocationType).map((locationType) => (
              <SelectItem key={locationType} value={locationType}>
                {LocationTypeLabels[locationType]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      {/* Адрес */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-medium">
          {labels.address || 'Адрес *'}
        </Label>
        <Input
          id="address"
          {...register('address')}
          placeholder={placeholders.address || 'Введите адрес локации'}
          className="w-full"
        />
        {errors.address && (
          <p className="text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      {showOptionalWarning && (
        <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Внимание
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Некоторые поля не заполнены, но это не критично для создания локации.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
