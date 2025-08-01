'use client';

import type { GetDriverDTO } from '@entities/users/interface';

interface DriverCarsInfoProps {
  driver: GetDriverDTO;
}

export function DriverCarsInfo({ driver }: DriverCarsInfoProps) {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Назначенные автомобили</h3>
      <div className='space-y-3'>
        {driver.activeCar ? (
          <div className='p-4 rounded-lg border bg-orange-50 border-orange-200'>
            <div className='flex items-center justify-between'>
              <div>
                <h4 className='font-medium'>{driver.activeCar.make} {driver.activeCar.model}</h4>
                <p className='text-sm text-muted-foreground'>
                  Гос. номер: {driver.activeCar.licensePlate}
                </p>
                <p className='text-sm text-muted-foreground'>
                  Год: {driver.activeCar.year} | Цвет: {driver.activeCar.color}
                </p>
                <p className='text-sm text-muted-foreground'>
                  Тип: {driver.activeCar.type} | Класс: {driver.activeCar.serviceClass}
                </p>
                <p className='text-sm text-muted-foreground'>
                  Вместимость: {driver.activeCar.passengerCapacity} чел. | Статус: {driver.activeCar.status}
                </p>
                {driver.activeCar.features && driver.activeCar.features.length > 0 && (
                  <p className='text-sm text-muted-foreground'>
                    Опции: {driver.activeCar.features.join(', ')}
                  </p>
                )}
              </div>
              <div className='text-right'>
                <span className='text-sm text-green-600 font-medium'>Активен</span>
                {driver.activeCar.drivers && driver.activeCar.drivers.length > 0 && (
                  <p className='text-xs text-muted-foreground mt-1'>
                    Назначен: {new Date(
                      driver.activeCar.drivers.find(d => d.driverId === driver.id)?.assignedAt || ''
                    ).toLocaleDateString('ru-RU')}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className='p-4 rounded-lg border bg-gray-50 border-gray-200'>
            <div className='text-center text-muted-foreground'>
              <p>Автомобиль не назначен</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
