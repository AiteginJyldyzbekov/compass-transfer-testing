'use client';

import { useFormContext } from 'react-hook-form';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import type { AdminCreateFormData } from '@entities/users/schemas/adminCreateSchema';

interface AdminProfileSectionProps {
  showOptionalWarning?: boolean;
}

export function AdminProfileSection({ showOptionalWarning = false }: AdminProfileSectionProps) {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<AdminCreateFormData>();
  const profile = watch('profile');

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='accessLevel'>Уровень доступа *</Label>
          <Input
            id='accessLevel'
            {...register('profile.accessLevel')}
            placeholder='Введите уровень доступа'
            className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              errors.profile?.accessLevel ? 'border-red-500' : ''
            }`}
          />
          {errors.profile?.accessLevel && (
            <p className='text-red-500 text-sm'>{errors.profile.accessLevel.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='department'>Отдел</Label>
          <Input
            id='department'
            {...register('profile.department')}
            placeholder='Введите название отдела'
            className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              errors.profile?.department
                ? 'border-red-500'
                : profile?.department === null && showOptionalWarning
                  ? 'border-yellow-400'
                  : ''
            }`}
          />
          {errors.profile?.department && (
            <p className='text-sm text-red-500'>
              {errors.profile.department.message || 'Ошибка валидации'}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='position'>Должность</Label>
          <Input
            id='position'
            {...register('profile.position')}
            placeholder='Введите должность'
            className={`focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
              errors.profile?.position
                ? 'border-red-500'
                : profile?.position === null && showOptionalWarning
                  ? 'border-yellow-400'
                  : ''
            }`}
          />
          {errors.profile?.position && (
            <p className='text-sm text-red-500'>
              {errors.profile.position.message || 'Ошибка валидации'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
