import { Car, Users, Calendar, Palette, Settings, Star } from 'lucide-react';
import { Badge } from '@shared/ui/data-display/badge';
import { Card, CardContent, CardHeader } from '@shared/ui/layout/card';
import type { GetCarDTO } from '@entities/cars/interface';
import { 
  getCarColorLabel, 
  getVehicleTypeLabel, 
  getServiceClassLabel, 
  getVehicleStatusLabel,
  getVehicleStatusColor,
  getCarFeatureLabel 
} from '@entities/cars/lib/car-helpers';

interface CarCardProps {
  car: GetCarDTO;
}

export function CarCard({ car }: CarCardProps) {
  return (
    <Card className='hover:shadow-md transition-shadow'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <Car className='h-6 w-6 text-blue-600' />
            </div>
            <div>
              <h3 className='font-semibold text-lg'>
                {car.make} {car.model}
              </h3>
              <p className='text-sm text-muted-foreground'>
                {car.licensePlate}
              </p>
            </div>
          </div>
          <Badge className={getVehicleStatusColor(car.status)}>
            {getVehicleStatusLabel(car.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className='space-y-4'>
        {/* Основная информация */}
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex items-center gap-2 text-sm'>
            <Calendar className='h-4 w-4 text-muted-foreground' />
            <span className='font-medium'>Год:</span>
            <span>{car.year}</span>
          </div>
          
          <div className='flex items-center gap-2 text-sm'>
            <Palette className='h-4 w-4 text-muted-foreground' />
            <span className='font-medium'>Цвет:</span>
            <span>{getCarColorLabel(car.color)}</span>
          </div>
          
          <div className='flex items-center gap-2 text-sm'>
            <Users className='h-4 w-4 text-muted-foreground' />
            <span className='font-medium'>Мест:</span>
            <span>{car.passengerCapacity}</span>
          </div>
          
          <div className='flex items-center gap-2 text-sm'>
            <Star className='h-4 w-4 text-muted-foreground' />
            <span className='font-medium'>Класс:</span>
            <span>{getServiceClassLabel(car.serviceClass)}</span>
          </div>
        </div>

        {/* Тип автомобиля */}
        <div className='flex items-center gap-2 text-sm'>
          <Settings className='h-4 w-4 text-muted-foreground' />
          <span className='font-medium'>Тип:</span>
          <span>{getVehicleTypeLabel(car.type)}</span>
        </div>

        {/* Особенности */}
        {car.features && car.features.length > 0 && (
          <div className='space-y-2'>
            <p className='text-sm font-medium'>Особенности:</p>
            <div className='flex flex-wrap gap-1'>
              {car.features.map((feature) => (
                <Badge key={feature} variant='secondary' className='text-xs'>
                  {getCarFeatureLabel(feature)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Водители */}
        {car.drivers && car.drivers.length > 0 && (
          <div className='space-y-2'>
            <p className='text-sm font-medium'>Назначенные водители:</p>
            <div className='flex flex-wrap gap-1'>
              {car.drivers.map((driverId) => (
                <Badge key={driverId} variant='outline' className='text-xs'>
                  ID: {driverId}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
