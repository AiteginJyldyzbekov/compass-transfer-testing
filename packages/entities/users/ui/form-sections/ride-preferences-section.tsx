'use client';

import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Badge } from '@shared/ui/data-display/badge';
import { Label } from '@shared/ui/forms/label';
import { ServiceClass } from '@entities/users/enums';
import { type RidePreferencesFields } from '@entities/users/model/validation/ui/ride-preferences';
import { getServiceClassLabel } from '@entities/users/utils/service-class-utils';

const rideTypeOptions = [
  { value: ServiceClass.Economy, label: getServiceClassLabel(ServiceClass.Economy) },
  { value: ServiceClass.Comfort, label: getServiceClassLabel(ServiceClass.Comfort) },
  { value: ServiceClass.ComfortPlus, label: getServiceClassLabel(ServiceClass.ComfortPlus) },
  { value: ServiceClass.Business, label: getServiceClassLabel(ServiceClass.Business) },
  { value: ServiceClass.Premium, label: getServiceClassLabel(ServiceClass.Premium) },
  { value: ServiceClass.Vip, label: getServiceClassLabel(ServiceClass.Vip) },
  { value: ServiceClass.Luxury, label: getServiceClassLabel(ServiceClass.Luxury) },
];

export function RidePreferencesSection() {
  const {
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<{ profile: RidePreferencesFields['profile'] }>();
  const formData = watch();
  const toggleRideType = useCallback(
    (rideType: string) => {
      const currentTypes = formData.profile.preferredRideTypes || [];
      const newTypes = currentTypes.includes(rideType)
        ? currentTypes.filter((t: string) => t !== rideType)
        : [...currentTypes, rideType];

      setValue('profile.preferredRideTypes', newTypes);
    },
    [formData.profile.preferredRideTypes, setValue],
  );

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-medium'>Предпочтения в работе</h3>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <Label>Предпочитаемые классы обслуживания *</Label>
          <div className='flex flex-wrap gap-2'>
            {rideTypeOptions.map(option => (
              <Badge
                key={option.value}
                variant={
                  formData.profile.preferredRideTypes?.includes(option.value)
                    ? 'default'
                    : 'outline'
                }
                className='cursor-pointer hover: hover:text-white hover:bg-green-800'
                onClick={() => toggleRideType(option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
          {errors.profile?.preferredRideTypes && (
            <p className='text-sm text-red-500'>
              {typeof errors.profile.preferredRideTypes.message === 'string'
                ? errors.profile.preferredRideTypes.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
