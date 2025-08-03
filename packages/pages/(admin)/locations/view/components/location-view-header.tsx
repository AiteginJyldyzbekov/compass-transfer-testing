import { MapPin, Clock } from 'lucide-react';
import { Badge } from '@shared/ui/data-display/badge';
import { Card, CardContent } from '@shared/ui/layout';
import type { LocationDTO } from '@entities/locations/interface';
import { LocationType } from '@entities/locations/enums';

interface LocationViewHeaderProps {
  location: LocationDTO;
}

// Переводы типов локаций
const locationTypeLabels: Record<LocationType, string> = {
  [LocationType.Home]: 'Дом',
  [LocationType.Work]: 'Работа',
  [LocationType.Airport]: 'Аэропорт',
  [LocationType.Hotel]: 'Отель',
  [LocationType.Restaurant]: 'Ресторан',
  [LocationType.Mall]: 'Торговый центр',
  [LocationType.Hospital]: 'Больница',
  [LocationType.School]: 'Школа',
  [LocationType.University]: 'Университет',
  [LocationType.Park]: 'Парк',
  [LocationType.Station]: 'Станция',
  [LocationType.Other]: 'Другое',
};

// Иконки для типов локаций
const locationTypeIcons: Record<LocationType, string> = {
  [LocationType.Home]: '🏠',
  [LocationType.Work]: '🏢',
  [LocationType.Airport]: '✈️',
  [LocationType.Hotel]: '🏨',
  [LocationType.Restaurant]: '🍽️',
  [LocationType.Mall]: '🛍️',
  [LocationType.Hospital]: '🏥',
  [LocationType.School]: '🏫',
  [LocationType.University]: '🎓',
  [LocationType.Park]: '🌳',
  [LocationType.Station]: '🚉',
  [LocationType.Other]: '📍',
};

export function LocationViewHeader({ location }: LocationViewHeaderProps) {
  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between'>
          <div className='flex items-start gap-4'>
            {/* Иконка типа локации */}
            <div className='flex-shrink-0'>
              <div className='w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl'>
                {locationTypeIcons[location.type as LocationType] || '📍'}
              </div>
            </div>

            {/* Основная информация */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-3 mb-2'>
                <h1 className='text-2xl font-bold text-gray-900 truncate'>
                  {location.name}
                </h1>
                <Badge variant={location.isActive ? 'default' : 'secondary'}>
                  {location.isActive ? 'Активна' : 'Неактивна'}
                </Badge>
              </div>

              <div className='flex items-center gap-2 text-gray-600 mb-2'>
                <MapPin className='h-4 w-4 flex-shrink-0' />
                <span className='text-sm'>{location.address}</span>
              </div>

              <div className='flex items-center gap-4 text-sm text-gray-500'>
                <div className='flex items-center gap-1'>
                  <span className='font-medium'>Тип:</span>
                  <span>{locationTypeLabels[location.type as LocationType] || location.type}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <span className='font-medium'>Координаты:</span>
                  <span>{location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Популярность */}
          <div className='flex flex-col gap-2'>
            {location.popular1 && (
              <Badge variant='outline' className='text-xs'>
                Топ точки
              </Badge>
            )}
            {location.popular2 && (
              <Badge variant='outline' className='text-xs'>
                Список топ точек
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
