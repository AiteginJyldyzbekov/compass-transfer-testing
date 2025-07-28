'use client';

import { Clock, Calendar, Play, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@shared/ui/data-display/skeleton';
import { useOrderStats } from '@features/my-orders/hooks/use-my-orders';

export function ProfileOrderStats() {
  const { stats, isLoading } = useOrderStats();

  if (isLoading) {
    return (
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className='flex items-center gap-2 bg-gradient-to-t from-primary/5 to-transparent shadow-sm rounded-2xl border p-3 min-w-0'
          >
            <Skeleton className='h-6 w-6 sm:h-8 sm:w-8 rounded-full flex-shrink-0' />
            <div className='flex flex-col gap-1 min-w-0'>
              <Skeleton className='h-3 sm:h-4 w-6 sm:w-8' />
              <Skeleton className='h-2 sm:h-3 w-12 sm:w-16' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statsConfig = [
    {
      key: 'pending',
      label: 'В ожидании',
      value: stats.pending,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      key: 'scheduled',
      label: 'Запланированы',
      value: stats.scheduled,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      key: 'inProgress',
      label: 'В процессе',
      value: stats.inProgress,
      icon: Play,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      key: 'completed',
      label: 'Завершены',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      key: 'cancelled',
      label: 'Отменены',
      value: stats.cancelled,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      key: 'expired',
      label: 'Просрочены',
      value: stats.expired,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className='grid grid-cols-2 sm:grid-cols-3 gap-2'>
      {statsConfig.map(({ key, label, value, icon: Icon, color, bgColor }) => (
        <div
          key={key}
          className='flex items-center gap-2 bg-gradient-to-t from-primary/5 to-transparent shadow-sm rounded-2xl border p-2 sm:p-3 min-w-0'
        >
          <div
            className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 ${bgColor} rounded-full flex items-center justify-center`}
          >
            <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${color}`} />
          </div>
          <div className='flex flex-col justify-center min-w-0'>
            <p className='text-sm sm:text-lg font-semibold text-gray-900 leading-tight'>{value}</p>
            <p className='text-xs text-gray-500 leading-tight truncate'>{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
