'use client';

import { Settings } from 'lucide-react';
import { Badge } from '@shared/ui/data-display/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import type { GetAdminDTO } from '@entities/users/interface';
import type { RoleSpecificSectionProps } from '@entities/users/ui/profile-sections/types';

// Type guard для проверки админа
function isAdminData(profile: RoleSpecificSectionProps['profile']): profile is GetAdminDTO {
  return 'role' in profile && profile.role === 'Admin';
}

export function AdminSection({ profile }: RoleSpecificSectionProps) {
  if (!isAdminData(profile)) return null;

  const adminProfile = profile.profile;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Settings className='h-5 w-5' />
          Административная информация
        </CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='border-l-4 border-red-200 pl-4 flex flex-col gap-2'>
            <label className='text-sm font-medium text-muted-foreground'>Уровень доступа</label>
            <Badge variant='destructive' className='w-fit'>
              {adminProfile.accessLevel}
            </Badge>
          </div>

          {adminProfile.department && (
            <div className='border-l-4 border-green-200 pl-4 flex flex-col gap-2'>
              <label className='text-sm font-medium text-muted-foreground'>Отдел</label>
              <p className='text-sm'>{adminProfile.department}</p>
            </div>
          )}

          {adminProfile.position && (
            <div className='border-l-4 border-purple-200 pl-4 flex flex-col gap-2'>
              <label className='text-sm font-medium text-muted-foreground'>Должность</label>
              <p className='text-sm'>{adminProfile.position}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
