'use client';

export function DriverPersonalInfo() {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Личная информация</h3>
      <div className='p-4 rounded-lg border bg-purple-50 border-purple-200'>
        <div className='space-y-3'>
          <div className='flex justify-between'>
            <span className='text-sm text-muted-foreground'>Семейное положение:</span>
            <span className='font-medium'>Женат</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-muted-foreground'>Дети:</span>
            <span className='font-medium'>2 ребенка</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-muted-foreground'>Образование:</span>
            <span className='font-medium'>Среднее специальное</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-muted-foreground'>Адрес проживания:</span>
            <span className='font-medium'>ул. Ленина, 123, кв. 45</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-muted-foreground'>Электронная почта:</span>
            <span className='font-medium'>driver@example.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
