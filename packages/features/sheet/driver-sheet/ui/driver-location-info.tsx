'use client';

export function DriverLocationInfo() {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Расположение на карте</h3>
      <div className='p-4 rounded-lg border bg-blue-50 border-blue-200 h-64 flex items-center justify-center'>
        <div className='text-center'>
          <div className='text-4xl mb-2'>🗺️</div>
          <p className='text-muted-foreground'>Карта будет загружена здесь</p>
          <p className='text-sm text-muted-foreground mt-1'>
            Последнее обновление: 2 минуты назад
          </p>
        </div>
      </div>
    </div>
  );
}
