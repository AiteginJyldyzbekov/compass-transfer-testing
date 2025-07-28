'use client';

import { Lock, MessageCircle, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@shared/ui/forms/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import { LogoutButton } from '@features/auth';
import { ChangePasswordModal } from '@features/auth/ui/modal/change-password-modal';

interface ProfileActionsProps {
  hidePasswordChange?: boolean; // Скрыть кнопку смены пароля
  showBackButton?: boolean; // Показать кнопку "Назад"
  onBack?: () => void; // Обработчик кнопки "Назад"
  hideLogout?: boolean; // Скрыть кнопку "Выйти"
}

export function ProfileActions({ 
  hidePasswordChange = false, 
  showBackButton = false, 
  onBack, 
  hideLogout = false 
}: ProfileActionsProps) {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const handleChangePassword = () => {
    setIsChangePasswordOpen(true);
  };

  const handleSendMessage = () => {};

  return (
    <div className='sticky top-4'>
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>Действия</CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-3 px-4 pb-4'>
          {!hidePasswordChange && (
            <Button
              onClick={handleChangePassword}
              className='w-full justify-start gap-2'
              variant='outline'
            >
              <Lock className='h-4 w-4' />
              Сменить пароль
            </Button>
          )}

          <Button
            onClick={handleSendMessage}
            className='w-full justify-start gap-2'
            variant='outline'
          >
            <MessageCircle className='h-4 w-4' />
            Написать сообщение
          </Button>

          {!hideLogout && (
            <LogoutButton variant='destructive' className='w-full justify-start' />
          )}
          {showBackButton && (
            <Button
              onClick={onBack}
              className='w-full justify-start gap-2'
              variant='outline'
            >
              <ArrowLeft className='h-4 w-4' />
              Назад к списку
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Модальное окно смены пароля */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
  );
}
