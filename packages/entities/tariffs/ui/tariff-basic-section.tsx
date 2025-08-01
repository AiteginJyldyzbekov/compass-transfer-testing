'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/forms/select';
import { CarTypeValues, type CarType } from '../enums/CarType.enum';
import { ServiceClassValues, type ServiceClass } from '../enums/ServiceClass.enum';
import type { TariffCreateFormData } from '../schemas/tariffCreateSchema';

interface TariffBasicSectionProps {
  showOptionalWarning?: boolean;
  labels?: {
    name?: string;
    serviceClass?: string;
    carType?: string;
  };
  placeholders?: {
    name?: string;
  };
}

export function TariffBasicSection({
  showOptionalWarning: _showOptionalWarning = false,
  labels = {},
  placeholders = {},
}: TariffBasicSectionProps) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<TariffCreateFormData>();

  const serviceClass = watch('serviceClass');
  const carType = watch('carType');

  return (
    <div className="space-y-6">
      {/* Название тарифа */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          {labels.name || 'Название тарифа *'}
        </Label>
        <Input
          id="name"
          {...register('name')}
          placeholder={placeholders.name || 'Введите название тарифа'}
          className="w-full"
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Класс обслуживания */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {labels.serviceClass || 'Класс обслуживания *'}
        </Label>
        <Select
          value={serviceClass}
          onValueChange={(value) => setValue('serviceClass', value as ServiceClass)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите класс обслуживания" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(ServiceClassValues).map((serviceClassValue) => (
              <SelectItem key={serviceClassValue} value={serviceClassValue}>
                {ServiceClassValues[serviceClassValue as ServiceClass]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.serviceClass && (
          <p className="text-sm text-red-600">{errors.serviceClass.message}</p>
        )}
      </div>

      {/* Тип автомобиля */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {labels.carType || 'Тип автомобиля *'}
        </Label>
        <Select
          value={carType}
          onValueChange={(value) => setValue('carType', value as CarType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите тип автомобиля" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(CarTypeValues).map((carTypeValue) => (
              <SelectItem key={carTypeValue} value={carTypeValue}>
                {CarTypeValues[carTypeValue as CarType]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.carType && (
          <p className="text-sm text-red-600">{errors.carType.message}</p>
        )}
      </div>
    </div>
  );
}
