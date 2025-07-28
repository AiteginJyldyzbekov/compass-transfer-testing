'use client';

import { Settings, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@shared/ui/forms/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/forms/select';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import { availableRoles, getMockProfileByRole } from '@entities/my-profile';
import type { Role } from '@entities/users/enums';
import type { GetUserSelfProfileDTO } from '@entities/users/interface';

interface RoleSwitcherProps {
  currentRole: Role;
  onRoleChange: (profile: GetUserSelfProfileDTO) => void;
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleRoleChange = (roleValue: string) => {
    const role = roleValue as Role;
    const newProfile = getMockProfileByRole(role);

    onRoleChange(newProfile);
  };

  const currentRoleLabel = availableRoles.find(r => r.role === currentRole)?.label || 'Неизвестно';

  if (!isOpen) {
    return (
      <div className='fixed top-4 right-4 z-50'>
        <Button
          onClick={() => setIsOpen(true)}
          variant='outline'
          size='sm'
          className='bg-white shadow-lg hover:shadow-xl transition-shadow'
        >
          <Settings className='h-4 w-4 mr-2' />
          Переключить роль
        </Button>
      </div>
    );
  }

  return (
    <div className='fixed top-4 right-4 z-50'>
      <Card className='w-80 shadow-xl bg-white'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-lg flex items-center gap-2'>
            <User className='h-5 w-5' />
            Переключатель ролей
          </CardTitle>
          <p className='text-sm text-muted-foreground'>
            Текущая роль: <span className='font-medium'>{currentRoleLabel}</span>
          </p>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Выберите роль:</label>
            <Select value={currentRole} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder='Выберите роль' />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map(({ role, label }) => (
                  <SelectItem key={role} value={role}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex gap-2'>
            <Button onClick={() => setIsOpen(false)} variant='outline' size='sm' className='flex-1'>
              Скрыть
            </Button>
          </div>

          <div className='text-xs text-muted-foreground bg-muted p-2 rounded'>
            💡 Этот переключатель доступен только в режиме разработки для тестирования верстки
            разных ролей.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
