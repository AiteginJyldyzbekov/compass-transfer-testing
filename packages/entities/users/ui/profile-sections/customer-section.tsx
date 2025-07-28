'use client';

import { Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import type { GetCustomerDTO } from '@entities/users/interface';
import type { RoleSpecificSectionProps } from './types';

// Type guard для проверки клиента
function isCustomerData(profile: RoleSpecificSectionProps['profile']): profile is GetCustomerDTO {
  return 'role' in profile && profile.role === 'Customer';
}

export function CustomerSection({ profile }: RoleSpecificSectionProps) {
  if (!isCustomerData(profile)) return null;

  return (
    <div className='flex flex-col gap-6'>
      {/* Основная информация клиента */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Информация клиента
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='border-l-4 border-green-200 pl-4 flex flex-col gap-2'>
              <label className='text-sm font-medium text-muted-foreground'>Баллы лояльности</label>
              <p className='text-sm font-medium'>{profile.loyaltyPoints || 0}</p>
            </div>

            <div className='border-l-4 border-purple-200 pl-4 flex flex-col gap-2'>
              <label className='text-sm font-medium text-muted-foreground'>Статус (Фантомный/Потвержденный)</label>
              <p className='text-sm font-medium'>{profile.phantom ? 'Фантомный' : 'Обычный'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
