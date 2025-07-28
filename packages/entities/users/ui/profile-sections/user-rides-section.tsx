'use client';

import { Car, RefreshCw } from 'lucide-react';
import { Button } from '@shared/ui/forms/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import { useUserRides } from '@features/user-rides/hooks/use-user-rides';
import { UserRidesList } from '@features/user-rides/ui/user-rides-list';

interface UserRidesSectionProps {
  userId: string;
}

export function UserRidesSection({ userId }: UserRidesSectionProps) {
  const { rides, total, isLoading, error, refetch } = useUserRides(userId);

  const handleViewDetails = (rideId: string) => {
    // Здесь будет логика перехода к детальному просмотру поездки
    window.open(`/rides/${rideId}`, '_blank');
  };

  if (error) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col items-center justify-center text-center space-y-4'>
            <Car className='h-12 w-12 text-red-500' />
            <div className='space-y-2'>
              <h3 className='text-lg font-semibold'>Ошибка загрузки</h3>
              <p className='text-muted-foreground max-w-md'>{error}</p>
            </div>
            <Button onClick={refetch} variant='outline'>
              <RefreshCw className='h-4 w-4 mr-2' />
              Попробовать снова
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Car className='h-5 w-5' />
            Поездки пользователя
            {!isLoading && total > 0 && (
              <span className='text-muted-foreground ml-2'>({total})</span>
            )}
          </CardTitle>
          <Button onClick={refetch} variant='outline' size='sm' disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <UserRidesList rides={rides} isLoading={isLoading} onViewDetails={handleViewDetails} />
      </CardContent>
    </Card>
  );
}
