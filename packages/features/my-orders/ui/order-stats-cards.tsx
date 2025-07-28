'use client';

import { Clock, Calendar, Play, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@shared/ui/data-display/skeleton';
import { Card, CardContent} from '@shared/ui/layout/card';
import type { OrderStatsDTO } from '@entities/orders/interface';

interface OrderStatsCardsProps {
  stats: OrderStatsDTO | null;
  isLoading: boolean;
}

export function OrderStatsCards({ stats, isLoading }: OrderStatsCardsProps) {
  if (isLoading) {
    return (
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardContent className='p-4'>
              <div className='flex items-center gap-3'>
                <Skeleton className='h-8 w-8 rounded' />
                <div className='flex flex-col gap-1'>
                  <Skeleton className='h-4 w-16' />
                  <Skeleton className='h-6 w-8' />
                </div>
              </div>
            </CardContent>
          </Card>
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
      borderColor: 'border-l-4 border-yellow-200',
    },
    {
      key: 'scheduled',
      label: 'Запланированы',
      value: stats.scheduled,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-l-4 border-blue-200',
    },
    {
      key: 'inProgress',
      label: 'В процессе',
      value: stats.inProgress,
      icon: Play,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      borderColor: 'border-l-4 border-purple-200',
    },
    {
      key: 'completed',
      label: 'Завершены',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-l-4 border-green-200',
    },
    {
      key: 'cancelled',
      label: 'Отменены',
      value: stats.cancelled,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-l-4 border-red-200',
    },
    {
      key: 'expired',
      label: 'Просрочены',
      value: stats.expired,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      borderColor: 'border-l-4 border-orange-200',
    },
  ];

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
      {statsConfig.map(({ key, label, value, icon: Icon, color, bgColor, borderColor }) => (
        <Card key={key} className={borderColor}>
          <CardContent className='p-4'>
            <div className='flex items-center gap-3'>
              <div className={`p-2 rounded-lg ${bgColor}`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div className='flex flex-col'>
                <p className='text-xs text-muted-foreground'>{label}</p>
                <p className='text-lg font-semibold'>{value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
