import { MapPin, Map, Star } from 'lucide-react';
import { Badge } from '@shared/ui/data-display/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout';
import { Separator } from '@shared/ui/layout/separator';
import type { LocationDTO } from '@entities/locations/interface';

interface LocationViewContentProps {
  location: LocationDTO;
}

export function LocationViewContent({ location }: LocationViewContentProps) {
  return (
    <div className='space-y-6'>

      {/* Адресная информация */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <MapPin className='h-5 w-5' />
            Адресная информация
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Полный адрес */}
          <div>
            <label className='text-sm font-medium text-gray-500'>Полный адрес</label>
            <p className='text-base text-gray-900 mt-1'>{location.address}</p>
          </div>

          <Separator />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Страна */}
            <div>
              <label className='text-sm font-medium text-gray-500'>Страна</label>
              <p className='text-base text-gray-900 mt-1'>{location.country || 'Не указана'}</p>
            </div>

            {/* Регион */}
            <div>
              <label className='text-sm font-medium text-gray-500'>Регион</label>
              <p className='text-base text-gray-900 mt-1'>{location.region || 'Не указан'}</p>
            </div>

            {/* Город */}
            <div>
              <label className='text-sm font-medium text-gray-500'>Город</label>
              <p className='text-base text-gray-900 mt-1'>{location.city || 'Не указан'}</p>
            </div>

            {/* Район */}
            <div>
              <label className='text-sm font-medium text-gray-500'>Район</label>
              <p className='text-base text-gray-900 mt-1'>{location.district || 'Не указан'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Координаты */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Map className='h-5 w-5' />
            Координаты
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Широта */}
            <div>
              <label className='text-sm font-medium text-gray-500'>Широта</label>
              <p className='text-base text-gray-900 mt-1 font-mono'>{location.latitude.toFixed(6)}</p>
            </div>

            {/* Долгота */}
            <div>
              <label className='text-sm font-medium text-gray-500'>Долгота</label>
              <p className='text-base text-gray-900 mt-1 font-mono'>{location.longitude.toFixed(6)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Отображение в терминале */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Star className='h-5 w-5' />
            Отображение в терминале
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-2'>
            {location.popular1 && (
              <Badge variant='outline' className='bg-yellow-50 text-yellow-700 border-yellow-200'>
                Локация которая показывается в терминале в начале (Топ точки)
              </Badge>
            )}
            {location.popular2 && (
              <Badge variant='outline' className='bg-orange-50 text-orange-700 border-orange-200'>
                Локация отображается в списке топ точек в терминале
              </Badge>
            )}
            {!location.popular1 && !location.popular2 && (
              <p className='text-gray-500 text-sm'>Локация не отображается в специальных списках терминала</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
