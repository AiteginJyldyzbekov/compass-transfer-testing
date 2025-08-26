'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Shield, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@shared/ui/forms/button';
import { Input } from '@shared/ui/forms/input';
import { Label } from '@shared/ui/forms/label';
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '@entities/auth/schemas/change-password';
import { useChangePassword } from '@features/auth/hooks/useChangePassword';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { changePassword, isLoading, error, success, fieldErrors, clearFieldError } =
    useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onSubmit',
  });

  // Обрабатываем успешную смену пароля
  useEffect(() => {
    if (success) {
      reset();
      onClose();
    }
  }, [success, reset, onClose]);

  const onSubmit = async (data: ChangePasswordFormData) => {
    await changePassword(data);
  };

  const handleClose = () => {
    if (!isLoading) {
      reset();
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Смена пароля</h3>
              <p className="text-sm text-gray-500 mt-1">
                Введите текущий пароль и новый пароль для смены
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Информационный блок */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Требования к паролю
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Минимум 8 символов, включая заглавные и строчные буквы, цифры
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* Текущий пароль */}
            <div className='space-y-2'>
              <Label htmlFor='oldPassword'>Текущий пароль</Label>
              <div className='relative'>
                <Input
                  id='oldPassword'
                  type={showOldPassword ? 'text' : 'password'}
                  placeholder='Введите текущий пароль'
                  {...register('oldPassword')}
                  onChange={e => {
                    register('oldPassword').onChange(e);
                    if (fieldErrors.oldPassword) {
                      clearFieldError('oldPassword');
                    }
                  }}
                  className={`pr-10 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
                    errors.oldPassword || fieldErrors.oldPassword ? 'border-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
                <button
                  type='button'
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                  disabled={isLoading}
                >
                  {showOldPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                </button>
              </div>
              {(errors.oldPassword || fieldErrors.oldPassword) && (
                <p className='text-sm text-red-500'>
                  {errors.oldPassword?.message || 'Неверный текущий пароль'}
                </p>
              )}
            </div>

            {/* Новый пароль */}
            <div className='space-y-2'>
              <Label htmlFor='newPassword'>Новый пароль</Label>
              <div className='relative'>
                <Input
                  id='newPassword'
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder='Введите новый пароль'
                  {...register('newPassword')}
                  onChange={e => {
                    register('newPassword').onChange(e);
                    if (fieldErrors.newPassword) {
                      clearFieldError('newPassword');
                    }
                  }}
                  className={`pr-10 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
                    errors.newPassword || fieldErrors.newPassword ? 'border-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
                <button
                  type='button'
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                  disabled={isLoading}
                >
                  {showNewPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                </button>
              </div>
              {(errors.newPassword || fieldErrors.newPassword) && (
                <p className='text-sm text-red-500'>
                  {errors.newPassword?.message || 'Новый пароль не соответствует требованиям'}
                </p>
              )}
            </div>

            {/* Подтверждение пароля */}
            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Подтвердите новый пароль</Label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Повторите новый пароль'
                  {...register('confirmPassword')}
                  className={`pr-10 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow ${
                    errors.confirmPassword ? 'border-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='text-sm text-red-500'>{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Общая ошибка */}
            {error && (
              <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
                <p className='text-sm text-red-600'>{error}</p>
              </div>
            )}

            {/* Footer */}
            <div className="flex gap-2 pt-4">
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                type='submit'
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Изменение...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Изменить пароль
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}