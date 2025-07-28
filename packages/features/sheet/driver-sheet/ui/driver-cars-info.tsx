'use client';

interface Driver {
  id: string;
  name: string;
  phone: string;
  carNumber: string;
}

interface DriverCarsInfoProps {
  driver: Driver;
}

export function DriverCarsInfo({ driver }: DriverCarsInfoProps) {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Назначенные автомобили</h3>
      <div className='space-y-3'>
        <div className='p-4 rounded-lg border bg-orange-50 border-orange-200'>
          <div className='flex items-center justify-between'>
            <div>
              <h4 className='font-medium'>Toyota Camry</h4>
              <p className='text-sm text-muted-foreground'>
                Гос. номер: {driver.carNumber}
              </p>
            </div>
            <span className='text-sm text-green-600 font-medium'>Активен</span>
          </div>
        </div>
        <div className='p-4 rounded-lg border bg-gray-50 border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <h4 className='font-medium'>Honda Accord</h4>
              <p className='text-sm text-muted-foreground'>Гос. номер: А123БВ</p>
            </div>
            <span className='text-sm text-gray-500 font-medium'>Резерв</span>
          </div>
        </div>
      </div>
    </div>
  );
}
