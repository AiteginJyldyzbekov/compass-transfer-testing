'use client';

export function DriverLicenseInfo() {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Водительское удостоверение</h3>
      <div className='p-4 rounded-lg border bg-green-50 border-green-200'>
        <div className='space-y-3'>
          <div className='flex justify-between'>
            <span className='text-sm text-muted-foreground'>
              Номер удостоверения:
            </span>
            <span className='font-medium'>12 АБ 345678</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-muted-foreground'>Категории:</span>
            <span className='font-medium'>B, C, D</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-muted-foreground'>Дата выдачи:</span>
            <span className='font-medium'>20.06.2020</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-muted-foreground'>Срок действия:</span>
            <span className='font-medium'>20.06.2030</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-muted-foreground'>Статус:</span>
            <span className='font-medium text-green-600'>Действительно</span>
          </div>
        </div>
      </div>
    </div>
  );
}
