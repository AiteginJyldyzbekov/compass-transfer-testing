'use client';

import { Monitor } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import type { GetTerminalDTO } from '@entities/users/interface';
import type { SectionWithMapProps } from '@entities/users/ui/profile-sections/types';

// Type guard для проверки терминала
function isTerminalData(profile: SectionWithMapProps['profile']): profile is GetTerminalDTO {
  return 'role' in profile && profile.role === 'Terminal';
}

export function TerminalSection({ profile, openMapSheet: _openMapSheet }: SectionWithMapProps) {
  if (!isTerminalData(profile)) return null;

  const terminalProfile = profile.profile;

  return (
    <div className='flex flex-col gap-6'>
      {/* Основная информация терминала */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Monitor className='h-5 w-5' />
            Информация терминала
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='border-l-4 border-blue-200 pl-4 flex flex-col gap-2'>
              <label className='text-sm font-medium text-muted-foreground'>ID терминала</label>
              <p className='text-sm font-mono'>{terminalProfile.terminalId}</p>
            </div>

            <div className='border-l-4 border-green-200 pl-4 flex flex-col gap-2'>
              <label className='text-sm font-medium text-muted-foreground'>IP адрес</label>
              <p className='text-sm font-mono'>{terminalProfile.ipAddress || 'Не указан'}</p>
            </div>

            <div className='border-l-4 border-purple-200 pl-4 flex flex-col gap-2'>
              <label className='text-sm font-medium text-muted-foreground'>Модель устройства</label>
              <p className='text-sm'>{terminalProfile.deviceModel || 'Не указана'}</p>
            </div>

            <div className='border-l-4 border-orange-200 pl-4 flex flex-col gap-2'>
              <label className='text-sm font-medium text-muted-foreground'>Версия ОС</label>
              <p className='text-sm'>{terminalProfile.osVersion || 'Не указана'}</p>
            </div>
          </div>

          <div className='border-l-4 border-pink-200 pl-4 flex flex-col gap-2'>
            <label className='text-sm font-medium text-muted-foreground'>Версия приложения</label>
            <p className='text-sm'>{terminalProfile.appVersion || 'Не указана'}</p>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}
