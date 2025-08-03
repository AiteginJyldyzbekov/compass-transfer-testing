'use client';

import { useFormContext } from 'react-hook-form';
import { Checkbox } from '@shared/ui/forms/checkbox';
import { Label } from '@shared/ui/forms/label';
import type { LocationCreateFormData } from '../schemas/locationCreateSchema';

interface LocationCoordinatesSectionProps {
  labels?: {
    isActive?: string;
    popular?: string;
  };
}

export function LocationCoordinatesSection({
  labels = {},
}: LocationCoordinatesSectionProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<LocationCreateFormData>();

  const isActive = watch('isActive');
  const popular = watch('popular');


  return (
    <div className="space-y-6">
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

        {/* Топ точки */}
        <div className="flex flex-row items-center space-x-3 rounded-lg border p-4">
          <Checkbox
            id="popular"
            checked={popular}
            onCheckedChange={(checked) => setValue('popular', checked)}
          />
          <div className="flex-1 space-y-0.5">
            <Label htmlFor="popular" className="text-sm font-medium cursor-pointer">
              {labels.popular || 'Локация которая показывается в терминале в начале (Топ точки)'}
            </Label>
            <div className="text-sm text-muted-foreground">
              Локация отображается в списке топ точек в терминале
            </div>
            {errors.popular && (
              <p className="text-sm text-red-600">{errors.popular.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
