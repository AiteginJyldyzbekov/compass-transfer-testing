'use client';

import type { GetDriverDTO } from '@entities/users/interface';

interface DriverPassportInfoProps {
  driver: GetDriverDTO;
}

export function DriverPassportInfo({ driver }: DriverPassportInfoProps) {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Паспортные данные</h3>
      <div className='p-4 rounded-lg border bg-blue-50 border-blue-200'>
        <div className='space-y-3'>
          <div className='flex justify-between'>
            <span className='text-sm text-muted-foreground'>Серия и номер:</span>
            <span className='font-medium'>
              {driver.profile.passport.series ? `${driver.profile.passport.series} ` : ''}
              {driver.profile.passport.number}
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-muted-foreground'>Дата выдачи:</span>
            <span className='font-medium'>
              {driver.profile.passport.issueDate
                ? new Date(driver.profile.passport.issueDate).toLocaleDateString('ru-RU')
                : 'Не указана'
              }
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-muted-foreground'>Кем выдан:</span>
            <span className='font-medium'>{driver.profile.passport.issuedBy || 'Не указано'}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-muted-foreground'>Срок действия:</span>
            <span className='font-medium'>
              {driver.profile.passport.expiryDate
                ? new Date(driver.profile.passport.expiryDate).toLocaleDateString('ru-RU')
                : 'Не указан'
              }
            </span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-muted-foreground'>Тип документа:</span>
            <span className='font-medium'>{driver.profile.passport.identityType || 'Не указан'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
