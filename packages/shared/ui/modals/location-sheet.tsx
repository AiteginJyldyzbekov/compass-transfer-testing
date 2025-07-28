'use client';

import { X, MapPin, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { locationsApi } from '@shared/api/locations';
import { logger } from '@shared/lib';
import { Badge } from '@shared/ui/data-display/badge';
import { Skeleton } from '@shared/ui/data-display/skeleton';
import { Button } from '@shared/ui/forms/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@shared/ui/modals/sheet';
import { locationTypeIcons, LocationTypeLabels } from '@entities/locations/enums';
import type { GetLocationDTO } from '@entities/locations/interface/GetLocationDTO';

interface LocationSheetProps {
  locationId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LocationSheet({ locationId, isOpen, onClose }: LocationSheetProps) {
  const [location, setLocation] = useState<GetLocationDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && locationId) {
      loadLocation(locationId);
    } else {
      setLocation(null);
      setError(null);
    }
  }, [isOpen, locationId]);

  const loadLocation = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const locationData = await locationsApi.getLocationById(id);

      setLocation(locationData);
    } catch (err) {
      logger.warn('Ошибка загрузки локации:', err);
      setError('Не удалось загрузить информацию о локации');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Активна' : 'Неактивна';
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='w-full sm:max-w-lg'>
        <SheetHeader className='space-y-4'>
          <div className='flex items-center justify-between'>
            <SheetTitle className='text-xl'>Информация о локации</SheetTitle>
            <Button variant='ghost' size='sm' onClick={onClose} className='h-8 w-8 p-0'>
              <X className='h-4 w-4' />
            </Button>
          </div>
        </SheetHeader>

        <div className='mt-6 space-y-6'>
          {isLoading ? (
            <div className='space-y-4'>
              <Skeleton className='h-8 w-3/4' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-2/3' />
              <div className='space-y-2'>
                <Skeleton className='h-6 w-1/2' />
                <Skeleton className='h-6 w-3/4' />
                <Skeleton className='h-6 w-2/3' />
              </div>
            </div>
          ) : error ? (
            <div className='text-center py-8'>
              <div className='text-red-500 mb-2'>⚠️</div>
              <p className='text-sm text-muted-foreground'>{error}</p>
            </div>
          ) : location ? (
            <>
              {/* Основная информация */}
              <div className='space-y-4'>
                <div className='flex items-start space-x-3'>
                  <div className='text-2xl'>{locationTypeIcons[location.type]}</div>
                  <div className='flex-1 min-w-0'>
                    <h3 className='text-lg font-semibold truncate'>{location.name}</h3>
                    <div className='flex items-center space-x-2 mt-1'>
                      <Badge variant='outline' className='text-xs'>
                        {LocationTypeLabels[location.type]}
                      </Badge>
                      <Badge
                        variant='secondary'
                        className={`text-xs ${getStatusColor(location.isActive)}`}
                      >
                        {getStatusText(location.isActive)}
                      </Badge>
                      {location.popular1 && (
                        <Star className='h-3 w-3 text-yellow-500 fill-current' />
                      )}
                      {location.popular2 && (
                        <Star className='h-3 w-3 text-orange-500 fill-current' />
                      )}
                    </div>
                  </div>
                </div>

                {/* Адрес */}
                <div className='space-y-2'>
                  <div className='flex items-start space-x-2'>
                    <MapPin className='h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0' />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium'>{location.address}</p>
                      <p className='text-xs text-muted-foreground'>
                        {location.district && `${location.district}, `}
                        {location.city}, {location.region}, {location.country}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Координаты */}
                <div className='bg-muted/50 rounded-lg p-3'>
                  <h4 className='text-sm font-medium mb-2'>Координаты</h4>
                  <p className='text-xs font-mono text-muted-foreground'>
                    {formatCoordinates(location.latitude, location.longitude)}
                  </p>
                </div>

                {/* Дополнительная информация */}
                <div className='space-y-3'>
                  <h4 className='text-sm font-medium'>Дополнительная информация</h4>

                  <div className='grid grid-cols-2 gap-3 text-sm'>
                    <div>
                      <span className='text-muted-foreground'>Город:</span>
                      <p className='font-medium'>{location.city}</p>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>Регион:</span>
                      <p className='font-medium'>{location.region}</p>
                    </div>
                    <div>
                      <span className='text-muted-foreground'>Страна:</span>
                      <p className='font-medium'>{location.country}</p>
                    </div>
                    {location.district && (
                      <div>
                        <span className='text-muted-foreground'>Район:</span>
                        <p className='font-medium'>{location.district}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Статус популярности */}
                {(location.popular1 || location.popular2) && (
                  <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
                    <div className='flex items-center space-x-2'>
                      <Star className='h-4 w-4 text-yellow-600' />
                      <span className='text-sm font-medium text-yellow-800'>
                        Популярная локация
                      </span>
                    </div>
                    <p className='text-xs text-yellow-700 mt-1'>
                      {location.popular1 && location.popular2
                        ? 'Высокая популярность'
                        : 'Популярная среди пользователей'}
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
