'use client';

import { Car, AlertCircle, RefreshCw } from 'lucide-react';
import { useMyCars } from '@features/my-cars/hooks/use-my-cars';
import { CarsFilters } from '@features/my-cars/ui/cars-filters';
import { CarsPagination } from '@features/my-cars/ui/cars-pagination';
import { CarCard } from '@entities/cars/ui/car-card';
import { Button } from '@shared/ui/forms/button';
import { Card, CardContent } from '@shared/ui/layout/card';
import { Skeleton } from '@shared/ui/data-display/skeleton';

export function MyCarsView() {
  const {
    cars,
    totalCount,
    pageSize,
    hasPrevious,
    hasNext,
    isLoading,
    error,
    refetch,
    updateFilters,
    currentFilters,
  } = useMyCars();

  if (error) {
    return (
      <Card className='p-6'>
        <CardContent className='flex flex-col items-center justify-center text-center space-y-4'>
          <AlertCircle className='h-12 w-12 text-red-500' />
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>Ошибка загрузки</h3>
            <p className='text-muted-foreground max-w-md'>{error}</p>
          </div>
          <Button onClick={refetch} variant='outline'>
            <RefreshCw className='h-4 w-4 mr-2' />
            Попробовать снова
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Фильтры */}
      <CarsFilters 
        onFiltersChange={updateFilters}
        currentFilters={currentFilters}
      />

      {/* Заголовок с количеством */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Car className='h-6 w-6 text-blue-600' />
          <h2 className='text-xl font-semibold'>
            Мои автомобили
            {!isLoading && (
              <span className='text-muted-foreground ml-2'>
                ({totalCount})
              </span>
            )}
          </h2>
        </div>
        
        <Button onClick={refetch} variant='outline' size='sm' disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Обновить
        </Button>
      </div>

      {/* Список автомобилей */}
      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardContent className='p-6 space-y-4'>
                <div className='flex items-center gap-3'>
                  <Skeleton className='h-10 w-10 rounded-lg' />
                  <div className='space-y-2'>
                    <Skeleton className='h-5 w-32' />
                    <Skeleton className='h-4 w-24' />
                  </div>
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-full' />
                  <Skeleton className='h-4 w-3/4' />
                  <Skeleton className='h-4 w-1/2' />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : cars.length === 0 ? (
        <Card className='p-12'>
          <CardContent className='flex flex-col items-center justify-center text-center space-y-4'>
            <Car className='h-16 w-16 text-muted-foreground' />
            <div className='space-y-2'>
              <h3 className='text-lg font-semibold'>Автомобили не найдены</h3>
              <p className='text-muted-foreground max-w-md'>
                У вас пока нет назначенных автомобилей или они не соответствуют выбранным фильтрам.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}

      {/* Пагинация */}
      {!isLoading && cars.length > 0 && (
        <CarsPagination
          totalCount={totalCount}
          pageSize={pageSize}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          currentFilters={currentFilters}
          onFiltersChange={updateFilters}
        />
      )}
    </div>
  );
}
