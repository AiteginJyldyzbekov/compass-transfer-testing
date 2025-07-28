'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Checkbox } from '@shared/ui/forms/checkbox';
import type { LocationCreateFormData } from '../schemas/locationCreateSchema';

interface LocationCoordinatesSectionProps {
  labels?: {
    latitude?: string;
    longitude?: string;
    isActive?: string;
    popular?: string;
    popular2?: string;
  };
  placeholders?: {
    latitude?: string;
    longitude?: string;
  };
}

export function LocationCoordinatesSection({
  labels = {},
  placeholders = {},
}: LocationCoordinatesSectionProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<LocationCreateFormData>();

  const isActive = watch('isActive');
  const popular = watch('popular');
  const popular2 = watch('popular2');

  return (
    <div className="space-y-6">
      {/* Координаты */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Широта */}
        <div className="space-y-2">
          <Label htmlFor="latitude" className="text-sm font-medium">
            {labels.latitude || 'Широта *'}
          </Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            placeholder={placeholders.latitude || '42.8746'}
            className="w-full"
            {...register('latitude', {
              valueAsNumber: true,
              setValueAs: (value) => value === '' ? undefined : parseFloat(value)
            })}
          />
          {errors.latitude && (
            <p className="text-sm text-red-600">{errors.latitude.message}</p>
          )}
        </div>

        {/* Долгота */}
        <div className="space-y-2">
          <Label htmlFor="longitude" className="text-sm font-medium">
            {labels.longitude || 'Долгота *'}
          </Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            placeholder={placeholders.longitude || '74.5698'}
            className="w-full"
            {...register('longitude', {
              valueAsNumber: true,
              setValueAs: (value) => value === '' ? undefined : parseFloat(value)
            })}
          />
          {errors.longitude && (
            <p className="text-sm text-red-600">{errors.longitude.message}</p>
          )}
        </div>
      </div>

      {/* Настройки локации */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Настройки локации</h3>
        
        {/* Активность */}
        <div className="flex flex-row items-center space-x-3 rounded-lg border p-4">
          <Checkbox
            id="isActive"
            checked={isActive}
            onCheckedChange={(checked) => setValue('isActive', checked)}
          />
          <div className="flex-1 space-y-0.5">
            <Label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
              {labels.isActive || 'Активная локация'}
            </Label>
            <div className="text-sm text-muted-foreground">
              Локация доступна для использования в системе
            </div>
            {errors.isActive && (
              <p className="text-sm text-red-600">{errors.isActive.message}</p>
            )}
          </div>
        </div>

        {/* Популярность */}
        <div className="flex flex-row items-center space-x-3 rounded-lg border p-4">
          <Checkbox
            id="popular"
            checked={popular}
            onCheckedChange={(checked) => setValue('popular', checked)}
          />
          <div className="flex-1 space-y-0.5">
            <Label htmlFor="popular" className="text-sm font-medium cursor-pointer">
              {labels.popular || 'Популярная локация'}
            </Label>
            <div className="text-sm text-muted-foreground">
              Локация отображается в списке популярных
            </div>
            {errors.popular && (
              <p className="text-sm text-red-600">{errors.popular.message}</p>
            )}
          </div>
        </div>

        {/* Популярность 2 */}
        <div className="flex flex-row items-center space-x-3 rounded-lg border p-4">
          <Checkbox
            id="popular2"
            checked={popular2}
            onCheckedChange={(checked) => setValue('popular2', checked)}
          />
          <div className="flex-1 space-y-0.5">
            <Label htmlFor="popular2" className="text-sm font-medium cursor-pointer">
              {labels.popular2 || 'Популярная локация 2'}
            </Label>
            <div className="text-sm text-muted-foreground">
              Дополнительная категория популярности
            </div>
            {errors.popular2 && (
              <p className="text-sm text-red-600">{errors.popular2.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
