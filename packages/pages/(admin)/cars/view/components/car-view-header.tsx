import { Car, Zap, Crown, Star, Gem, Sparkles, Diamond, Calendar } from 'lucide-react';
import { Badge } from '@shared/ui/data-display/badge';
import { Card, CardContent } from '@shared/ui/layout';
import type { GetCarDTO } from '@entities/cars/interface';
import { ServiceClass, ServiceClassValues, CarType, CarTypeValues } from '@entities/tariffs/enums';

interface CarViewHeaderProps {
  car: GetCarDTO;
}

// Иконки для классов обслуживания
const serviceClassIcons: Record<ServiceClass, React.ComponentType<{ className?: string }>> = {
  [ServiceClass.Economy]: Car,
  [ServiceClass.Comfort]: Zap,
  [ServiceClass.ComfortPlus]: Star,
  [ServiceClass.Business]: Crown,
  [ServiceClass.Premium]: Gem,
  [ServiceClass.Vip]: Sparkles,
  [ServiceClass.Luxury]: Diamond,
};

export function CarViewHeader({ car }: CarViewHeaderProps) {
  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between'>
          <div className='flex items-start gap-4'>
            {/* Иконка класса обслуживания */}
            <div className='flex-shrink-0'>
              <div className='w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center'>
                {(() => {
                  const IconComponent = serviceClassIcons[car.serviceClass as ServiceClass];
                  return IconComponent ? <IconComponent className='h-8 w-8 text-purple-600' /> : <Car className='h-8 w-8 text-purple-600' />;
                })()}
              </div>
            </div>

            {/* Основная информация */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-3 mb-2'>
                <h1 className='text-2xl font-bold text-gray-900 truncate'>
                  {car.make} {car.model}
                </h1>
                <Badge variant='default'>
                  {car.licensePlate}
                </Badge>
              </div>

              <div className='flex items-center gap-2 text-gray-600 mb-2'>
                <Calendar className='h-4 w-4 flex-shrink-0' />
                <span className='text-sm'>Год выпуска: {car.year}</span>
              </div>

              <div className='flex items-center gap-4 text-sm text-gray-500'>
                <div className='flex items-center gap-1'>
                  <span className='font-medium'>Класс:</span>
                  <span>{ServiceClassValues[car.serviceClass as ServiceClass] || car.serviceClass}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <span className='font-medium'>Тип:</span>
                  <span>{CarTypeValues[car.type as CarType] || car.type}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <span className='font-medium'>Цвет:</span>
                  <span>{car.color}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
