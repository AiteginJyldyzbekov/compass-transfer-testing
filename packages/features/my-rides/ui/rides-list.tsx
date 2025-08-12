'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Car, MapPin, Clock, Route, Eye } from 'lucide-react';
import { Badge } from '@shared/ui/data-display/badge';
import { DataTable } from '@shared/ui/data-table';
import { Button } from '@shared/ui/forms/button';
import type { GetRideDTO } from '@entities/rides/interface';

interface RidesListProps {
  rides: GetRideDTO[];
  isLoading: boolean;
  onViewDetails: (orderId: string) => void;
}

const getStatusColor = (status: string) => {
  const colors = {
    Requested: 'bg-yellow-100 text-yellow-800',
    Accepted: 'bg-blue-100 text-blue-800',
    InProgress: 'bg-purple-100 text-purple-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  };
  
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const getStatusLabel = (status: string) => {
  const labels = {
    Requested: 'Запрошена',
    Accepted: 'Принята',
    InProgress: 'В процессе',
    Completed: 'Завершена',
    Cancelled: 'Отменена',
  };
  
  return labels[status as keyof typeof labels] || status;
};

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return '-';

  return new Date(dateString).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function RidesList({ rides, isLoading, onViewDetails }: RidesListProps) {
  const columns: ColumnDef<GetRideDTO>[] = [
    {
      accessorKey: 'id',
      header: 'ID поездки',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Car className='h-4 w-4 text-blue-600' />
          <span className='font-medium text-sm'>{row.original.id.slice(0, 8)}...</span>
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      cell: ({ row }) => (
        <Badge className={`${getStatusColor(row.original.status)} w-fit`}>
          {getStatusLabel(row.original.status)}
        </Badge>
      ),
    },
    {
      accessorKey: 'waypoints',
      header: 'Маршрут',
      cell: ({ row }) => {
        const waypoints = row.original.waypoints || [];

        if (waypoints.length === 0) return '-';
        
        const firstLocation = waypoints[0]?.location;
        const lastLocation = waypoints[waypoints.length - 1]?.location;
        
        return (
          <div className='flex items-center gap-2 max-w-xs'>
            <MapPin className='h-4 w-4 text-muted-foreground flex-shrink-0' />
            <div className='text-sm truncate'>
              {firstLocation?.name || firstLocation?.address || 'Неизвестно'}
              {waypoints.length > 1 && (
                <span className='text-muted-foreground'> → {lastLocation?.name || lastLocation?.address || 'Неизвестно'}</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'startedAt',
      header: 'Начало',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Clock className='h-4 w-4 text-muted-foreground' />
          <span className='text-sm'>{formatDate(row.original.startedAt)}</span>
        </div>
      ),
    },
    {
      accessorKey: 'endedAt',
      header: 'Окончание',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Clock className='h-4 w-4 text-muted-foreground' />
          <span className='text-sm'>{formatDate(row.original.endedAt)}</span>
        </div>
      ),
    },
    {
      accessorKey: 'distance',
      header: 'Расстояние',
      cell: ({ row }) => {
        const distance = row.original.distance;
        
        if (!distance) return '-';

        return (
          <div className='flex items-center gap-2'>
            <Route className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm'>{distance.toFixed(1)} км</span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => (
        <Button
          onClick={() => onViewDetails(row.original.id)}
          variant='outline'
          size='sm'
          className='gap-2'
        >
          <Eye className='h-4 w-4' />
          Подробнее
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={rides}
      isLoading={isLoading}
      emptyState={{
        icon: Car,
        title: 'Поездки не найдены',
        description: 'У вас пока нет поездок или они не соответствуют выбранным фильтрам.',
      }}
    />
  );
}
