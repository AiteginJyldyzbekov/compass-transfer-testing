import { Info, Settings, Users, Star, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout';
import { Button } from '@shared/ui/forms/button';
import { Badge } from '@shared/ui/data-display/badge';
import type { GetCarDTO } from '@entities/cars/interface';
import { ServiceClass, ServiceClassValues, CarType, CarTypeValues } from '@entities/tariffs/enums';
import { CarFeature } from '@entities/cars/enums';
import { CarDriversList } from './car-drivers-list';

interface CarViewContentProps {
  car: GetCarDTO;
  onRemoveDriver?: (driverId: string) => Promise<void>;
  onAddFeature?: () => void;
}

// Переводы опций автомобиля
const carFeatureLabels: Record<CarFeature, string> = {
  [CarFeature.AirConditioning]: 'Кондиционер',
  [CarFeature.ClimateControl]: 'Климат-контроль',
  [CarFeature.LeatherSeats]: 'Кожаные сидения',
  [CarFeature.HeatedSeats]: 'Подогрев сидений',
  [CarFeature.Bluetooth]: 'Bluetooth',
  [CarFeature.USBPort]: 'USB-порт',
  [CarFeature.AuxInput]: 'AUX-вход',
  [CarFeature.Navigation]: 'Навигация',
  [CarFeature.BackupCamera]: 'Камера заднего вида',
  [CarFeature.ParkingSensors]: 'Парковочные датчики',
  [CarFeature.Sunroof]: 'Люк',
  [CarFeature.PanoramicRoof]: 'Панорамная крыша',
  [CarFeature.ThirdRowSeats]: 'Третий ряд сидений',
  [CarFeature.ChildSeat]: 'Детское кресло',
  [CarFeature.WheelchairAccess]: 'Доступ для инвалидных колясок',
  [CarFeature.Wifi]: 'Wi-Fi',
  [CarFeature.PremiumAudio]: 'Премиальная аудиосистема',
  [CarFeature.AppleCarplay]: 'Apple CarPlay',
  [CarFeature.AndroidAuto]: 'Android Auto',
  [CarFeature.SmokingAllowed]: 'Разрешено курение',
  [CarFeature.PetFriendly]: 'Дружелюбно к питомцам',
  [CarFeature.LuggageCarrier]: 'Багажник на крыше',
  [CarFeature.BikeRack]: 'Велосипедная стойка',
};

export function CarViewContent({ car, onRemoveDriver, onAddFeature }: CarViewContentProps) {
  return (
    <div className='space-y-6'>
      {/* Основная информация */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Info className='h-5 w-5' />
            Основная информация
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Марка */}
            <div>
              <label className='text-sm font-medium text-gray-500'>Марка</label>
              <p className='text-lg font-semibold text-gray-900 mt-1'>{car.make}</p>
            </div>

            {/* Модель */}
            <div>
              <label className='text-sm font-medium text-gray-500'>Модель</label>
              <p className='text-lg font-semibold text-gray-900 mt-1'>{car.model}</p>
            </div>

            {/* Год выпуска */}
            <div>
              <label className='text-sm font-medium text-gray-500'>Год выпуска</label>
              <p className='text-base text-gray-900 mt-1'>{car.year}</p>
            </div>

            {/* Номерной знак */}
            <div>
              <label className='text-sm font-medium text-gray-500'>Номерной знак</label>
              <p className='text-base text-gray-900 mt-1 font-mono bg-gray-100 px-2 py-1 rounded'>
                {car.licensePlate}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Характеристики */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Settings className='h-5 w-5' />
            Характеристики
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Класс обслуживания */}
            <div>
              <label className='text-sm font-medium text-gray-500'>Класс обслуживания</label>
              <p className='text-base text-gray-900 mt-1'>
                {ServiceClassValues[car.serviceClass as ServiceClass] || car.serviceClass}
              </p>
            </div>

            {/* Тип автомобиля */}
            <div>
              <label className='text-sm font-medium text-gray-500'>Тип автомобиля</label>
              <p className='text-base text-gray-900 mt-1'>
                {CarTypeValues[car.type as CarType] || car.type}
              </p>
            </div>

            {/* Количество мест */}
            <div>
              <label className='text-sm font-medium text-gray-500'>Количество мест</label>
              <p className='text-base text-gray-900 mt-1'>{car.passengerCapacity}</p>
            </div>

            {/* Цвет */}
            <div>
              <label className='text-sm font-medium text-gray-500'>Цвет</label>
              <p className='text-base text-gray-900 mt-1'>{car.color}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Дополнительные опции */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Star className='h-5 w-5' />
              Дополнительные опции
            </CardTitle>
            {onAddFeature && (
              <Button
                variant='outline'
                size='sm'
                onClick={onAddFeature}
                className='flex items-center gap-2'
              >
                <Plus className='h-4 w-4' />
                Добавить опцию
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {car.features && car.features.length > 0 ? (
            <div className='flex flex-wrap gap-2'>
              {car.features.map((feature) => (
                <Badge
                  key={feature}
                  variant='outline'
                  className='bg-green-50 text-green-700 border-green-200'
                >
                  {carFeatureLabels[feature as CarFeature] || feature}
                </Badge>
              ))}
            </div>
          ) : (
            <div className='text-center py-8'>
              <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <Star className='h-8 w-8 text-gray-400' />
              </div>
              <p className='text-gray-500 text-sm mb-4'>
                У этого автомобиля нет дополнительных опций
              </p>
              {onAddFeature && (
                <Button
                  variant='outline'
                  onClick={onAddFeature}
                  className='flex items-center gap-2'
                >
                  <Plus className='h-4 w-4' />
                  Добавить первую опцию
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Назначенные водители */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Назначенные водители
            {car.drivers.length >= 2 && (
              <Badge variant='secondary' className='text-xs ml-2'>
                Максимум: 2/2
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CarDriversList
            carId={car.id}
            drivers={car.drivers}
            onRemoveDriver={onRemoveDriver}
          />
        </CardContent>
      </Card>


    </div>
  );
}
