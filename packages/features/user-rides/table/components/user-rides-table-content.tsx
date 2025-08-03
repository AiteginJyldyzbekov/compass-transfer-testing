'use client';

import { Car, Eye, MapPin, Clock, Route, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Badge } from '@shared/ui/data-display/badge';
import { Button } from '@shared/ui/forms/button';
import { Skeleton } from '@shared/ui/data-display/skeleton';
import type { GetRideDTO } from '@entities/rides/interface';

interface ColumnVisibility {
  status: boolean;
  startLocation: boolean;
  endLocation: boolean;
  distance: boolean;
  duration: boolean;
  startTime: boolean;
  endTime: boolean;
  actions: boolean;
}

interface UserRidesTableContentProps {
  rides: GetRideDTO[];
  loading: boolean;
  columnVisibility: ColumnVisibility;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (column: string, order: 'asc' | 'desc') => void;
  onViewDetails: (rideId: string) => void;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'Requested':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Searching':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Accepted':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Arrived':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'InProgress':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'Completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'Requested':
      return 'Запрошена';
    case 'Searching':
      return 'Поиск водителя';
    case 'Accepted':
      return 'Принята водителем';
    case 'Arrived':
      return 'Водитель прибыл';
    case 'InProgress':
      return 'В процессе';
    case 'Completed':
      return 'Завершена';
    case 'Cancelled':
      return 'Отменена';
    default:
      return status;
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}ч ${minutes}м`;
  }
  return `${minutes}м`;
}

export function UserRidesTableContent({
  rides,
  loading,
  columnVisibility,
  sortBy,
  sortOrder,
  onSortChange,
  onViewDetails,
}: UserRidesTableContentProps) {
  const handleSort = (column: string) => {
    if (sortBy === column) {
      onSortChange(column, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(column, 'desc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="border rounded-lg">
        <div className="p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4 py-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (rides.length === 0) {
    return (
      <div className="border rounded-lg p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <Car className="h-12 w-12 text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Поездки не найдены</h3>
            <p className="text-muted-foreground">У этого пользователя пока нет поездок или они не соответствуют фильтрам.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {columnVisibility.status && (
                <th className="text-left p-3 font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('status')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Статус
                    {getSortIcon('status')}
                  </Button>
                </th>
              )}
              {columnVisibility.startLocation && (
                <th className="text-left p-3 font-medium">Откуда</th>
              )}
              {columnVisibility.endLocation && (
                <th className="text-left p-3 font-medium">Куда</th>
              )}
              {columnVisibility.distance && (
                <th className="text-left p-3 font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('distance')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Расстояние
                    {getSortIcon('distance')}
                  </Button>
                </th>
              )}
              {columnVisibility.duration && (
                <th className="text-left p-3 font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('duration')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Длительность
                    {getSortIcon('duration')}
                  </Button>
                </th>
              )}
              {columnVisibility.startTime && (
                <th className="text-left p-3 font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('startTime')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Время начала
                    {getSortIcon('startTime')}
                  </Button>
                </th>
              )}
              {columnVisibility.endTime && (
                <th className="text-left p-3 font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('endTime')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Время окончания
                    {getSortIcon('endTime')}
                  </Button>
                </th>
              )}
              {columnVisibility.actions && (
                <th className="text-left p-3 font-medium"></th>
              )}
            </tr>
          </thead>
          <tbody>
            {rides.map((ride) => (
              <tr key={ride.id} className="border-t hover:bg-muted/25">
                {columnVisibility.status && (
                  <td className="p-3">
                    <Badge className={`${getStatusColor(ride.status)} w-fit`}>
                      {getStatusLabel(ride.status)}
                    </Badge>
                  </td>
                )}
                {columnVisibility.startLocation && (
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="text-sm max-w-32 truncate" title={ride.startLocation?.address}>
                        {ride.startLocation?.address || 'Не указано'}
                      </span>
                    </div>
                  </td>
                )}
                {columnVisibility.endLocation && (
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-red-600" />
                      <span className="text-sm max-w-32 truncate" title={ride.endLocation?.address}>
                        {ride.endLocation?.address || 'Не указано'}
                      </span>
                    </div>
                  </td>
                )}
                {columnVisibility.distance && (
                  <td className="p-3">
                    {ride.distance ? (
                      <div className="flex items-center gap-2">
                        <Route className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{ride.distance.toFixed(1)} км</span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                )}
                {columnVisibility.duration && (
                  <td className="p-3">
                    {ride.duration ? (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDuration(ride.duration)}</span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                )}
                {columnVisibility.startTime && (
                  <td className="p-3">
                    {ride.startTime ? (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{formatDate(ride.startTime)}</span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                )}
                {columnVisibility.endTime && (
                  <td className="p-3">
                    {ride.endTime ? (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-red-600" />
                        <span className="text-sm">{formatDate(ride.endTime)}</span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                )}
                {columnVisibility.actions && (
                  <td className="p-3">
                    <Button
                      onClick={() => onViewDetails(ride.id)}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="Подробнее"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
