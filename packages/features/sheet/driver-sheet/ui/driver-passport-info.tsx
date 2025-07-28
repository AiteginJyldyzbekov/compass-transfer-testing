'use client';

export function DriverPassportInfo() {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Паспортные данные</h3>
      <div className='p-4 rounded-lg border bg-blue-50 border-blue-200'>
        <div className='space-y-3'>
          <div className='flex justify-between'>
            <span className='text-sm text-muted-foreground'>Серия и номер:</span>
            <span className='font-medium'>1234 567890</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-muted-foreground'>Дата выдачи:</span>
            <span className='font-medium'>15.03.2018</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-muted-foreground'>Кем выдан:</span>
            <span className='font-medium'>УФМС России по г. Бишкек</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-muted-foreground'>Дата рождения:</span>
            <span className='font-medium'>12.05.1985</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-muted-foreground'>Место рождения:</span>
            <span className='font-medium'>г. Бишкек</span>
          </div>
        </div>
      </div>
    </div>
  );
}
