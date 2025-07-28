'use client';

import { Clock, Calendar, Play, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@shared/ui/data-display/skeleton';
import { useUserOrderStats } from '@features/user-orders/hooks/use-user-order-stats';

interface UserProfileOrderStatsProps {
  userId: string;
}

export function UserProfileOrderStats({ userId }: UserProfileOrderStatsProps) {
  const { stats, isLoading } = useUserOrderStats(userId);

  if (isLoading) {
    return (
      <div className='flex flex-wrap gap-2'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className='flex items-center gap-2 bg-gradient-to-t from-primary/5 to-transparent shadow-sm rounded-2xl border p-3'
            style={{ width: '183px', height: '60px' }}
          >
            <Skeleton className='h-8 w-8 rounded-full' />
            <div className='flex flex-col gap-1'>
              <Skeleton className='h-4 w-8' />
              <Skeleton className='h-3 w-16' />
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
    <div className='flex flex-wrap gap-2'>
      {statsConfig.map(({ key, label, value, icon: Icon, color, bgColor }) => (
        <div
          key={key}
          className='flex items-center gap-2 bg-gradient-to-t from-primary/5 to-transparent shadow-sm rounded-2xl border p-3'
          style={{ width: '183px', height: '60px' }}
        >
          <div
            className={`flex-shrink-0 w-8 h-8 ${bgColor} rounded-full flex items-center justify-center`}
          >
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <div className='flex flex-col justify-center min-w-0'>
            <p className='text-lg font-semibold text-gray-900 leading-tight'>{value}</p>
            <p className='text-xs text-gray-500 leading-tight truncate'>{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
