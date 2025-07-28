'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/forms/select';
import {
  type PassportDataFields,
} from '@entities/users/model/validation/ui/passport-data';
import { identityDocumentOptions } from '@entities/users/utils/identity-document-utils';

export function PassportDataSection() {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<{ profile: PassportDataFields['profile'] }>();
  const formData = watch();

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-medium'>Паспортные данные</h3>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='passportNumber'>Номер паспорта *</Label>
          <Input
            id='passportNumber'
            {...register('profile.passport.number')}
            placeholder='Введите номер паспорта'
            className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              errors.profile?.passport?.number ? 'border-red-500' : ''
            }`}
          />
          {errors.profile?.passport?.number && (
            <p className='text-sm text-red-500'>
              {typeof errors.profile.passport.number.message === 'string'
                ? errors.profile.passport.number.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='identityType'>Тип документа *</Label>
          <Select
            {...register('profile.passport.identityType')}
            value={formData.profile.passport.identityType}
          >
            <SelectTrigger
              className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow [&>span]:flex-1 [&>span]:text-left ${
                errors.profile?.passport?.identityType ? 'border-red-500' : ''
              }`}
            >
              <SelectValue placeholder='Выберите тип документа' />
            </SelectTrigger>
            <SelectContent>
              {identityDocumentOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.profile?.passport?.identityType && (
            <p className='text-sm text-red-500'>
              {typeof errors.profile.passport.identityType.message === 'string'
                ? errors.profile.passport.identityType.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
