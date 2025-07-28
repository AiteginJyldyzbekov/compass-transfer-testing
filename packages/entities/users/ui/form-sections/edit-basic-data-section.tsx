'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';

interface EditBasicDataSectionProps {
  showOptionalPhoneWarning?: boolean;
  labels?: {
    fullName?: string;
    phoneNumber?: string;
  };
  placeholders?: {
    fullName?: string;
    phoneNumber?: string;
  };
}

export function EditBasicDataSection({
  labels = {},
  placeholders = {},
  showOptionalPhoneWarning,
}: EditBasicDataSectionProps) {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext();
  
  const defaultLabels = {
    fullName: 'Полное имя *',
    phoneNumber: 'Телефон',
    ...labels,
  };

  const defaultPlaceholders = {
    fullName: 'Введите полное имя',
    phoneNumber: '+996 555 123 456',
    ...placeholders,
  };

  const phoneNumberValue = watch('phoneNumber');

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='fullName'>{defaultLabels.fullName}</Label>
          <Input
            id='fullName'
            {...register('fullName')}
            placeholder={defaultPlaceholders.fullName}
            className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              errors.fullName ? 'border-red-500' : ''
            }`}
          />
          {errors.fullName && (
            <p className='text-sm text-red-500'>
              {typeof errors.fullName.message === 'string'
                ? errors.fullName.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='phoneNumber'>{defaultLabels.phoneNumber}</Label>
          <Input
            id='phoneNumber'
            type='tel'
            {...register('phoneNumber')}
            placeholder={defaultPlaceholders.phoneNumber}
            className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              errors.phoneNumber
                ? 'border-red-500'
                : !phoneNumberValue && showOptionalPhoneWarning
                  ? 'border-yellow-400'
                  : ''
            }`}
          />
          {errors.phoneNumber && (
            <p className='text-sm text-red-500'>
              {typeof errors.phoneNumber.message === 'string'
                ? errors.phoneNumber.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
