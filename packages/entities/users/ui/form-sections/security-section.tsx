'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import { usePasswordLogic } from '@entities/users/hooks/use-password-logic';
import { type SecurityFormData } from '@entities/users/model/validation/ui/security';

// Updated to support extended form types
interface SecuritySectionProps {
  labels?: {
    password?: string;
    confirmPassword?: string;
  };
  placeholders?: {
    password?: string;
    confirmPassword?: string;
  };
}

export function SecuritySection({ labels = {}, placeholders = {} }: SecuritySectionProps) {
  const {
    register,
    formState: { errors },
    watch,
  } = useFormContext<SecurityFormData>();
  const formData = watch();
  const {
    showPassword,
    showConfirmPassword,
    confirmPassword,
    setConfirmPassword,
    hasCyrillic,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
    getPasswordMatchStatus,
  } = usePasswordLogic();

  const defaultLabels = {
    password: 'Пароль *',
    confirmPassword: 'Подтвердите пароль *',
    ...labels,
  };

  const defaultPlaceholders = {
    password: 'Минимум 8 символов',
    confirmPassword: 'Повторите пароль',
    ...placeholders,
  };

  const passwordMatchStatus = getPasswordMatchStatus(formData.password || '', formData.confirmPassword || '');

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='password'>{defaultLabels.password}</Label>
          <div className='relative'>
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              placeholder={defaultPlaceholders.password}
              className={`pr-10 focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
                errors.password ? 'border-red-500' : ''
              }`}
            />
            <button
              type='button'
              onClick={togglePasswordVisibility}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
            >
              {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
            </button>
          </div>
          {errors.password && (
            <p className='text-sm text-red-500'>
              {typeof errors.password.message === 'string'
                ? errors.password.message
                : 'Ошибка валидации'}
            </p>
          )}
          {formData.password && hasCyrillic(formData.password) && (
            <p className='text-sm text-red-500'>Пароль не должен содержать кириллицу</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='confirmPassword'>{defaultLabels.confirmPassword}</Label>
          <div className='relative'>
            <Input
              id='confirmPassword'
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              placeholder={defaultPlaceholders.confirmPassword}
              className={`pr-10 focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
                passwordMatchStatus === 'mismatch' ? 'border-red-500' : ''
              }`}
            />
            <button
              type='button'
              onClick={toggleConfirmPasswordVisibility}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
            >
              {showConfirmPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
            </button>
          </div>
          {passwordMatchStatus === 'mismatch' && (
            <p className='text-sm text-red-500'>Пароли не совпадают</p>
          )}
          {passwordMatchStatus === 'match' && (
            <p className='text-sm text-green-500'>Пароли совпадают</p>
          )}
          {errors.confirmPassword && (
            <p className='text-sm text-red-500'>
              {typeof errors.confirmPassword.message === 'string'
                ? errors.confirmPassword.message
                : 'Ошибка валидации'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
