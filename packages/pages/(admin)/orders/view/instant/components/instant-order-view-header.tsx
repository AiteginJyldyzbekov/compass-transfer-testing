import { Clock, MapPin, DollarSign } from 'lucide-react';
import { Badge } from '@shared/ui/data-display/badge';
import { Card, CardContent } from '@shared/ui/layout';
import { Skeleton } from '@shared/ui/data-display/skeleton';
import type { GetOrderDTO } from '@entities/orders/interface';
import { orderStatusLabels, orderSubStatusLabels, orderStatusColors } from '@entities/orders';
import { useLocation } from '@features/locations/hooks/useLocation';

interface InstantOrderViewHeaderProps {
  order: GetOrderDTO;
}

export function InstantOrderViewHeader({ order }: InstantOrderViewHeaderProps) {
  // Запросы для получения локаций
  const { location: startLocation, isLoading: startLocationLoading } = useLocation(order.startLocationId || '');
  const { location: endLocation, isLoading: endLocationLoading } = useLocation(order.endLocationId || '');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number | null | undefined) => {
    if (!price || price === 0) return 'В процессе';
    return new Intl.NumberFormat('ru-RU').format(price) + ' сом';
  };

  return (
    <Card>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between'>
          <div className='flex items-start gap-4'>
            {/* Иконка заказа */}
            <div className='flex-shrink-0'>
              <div className='w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center'>
                <Clock className='h-8 w-8 text-blue-600' />
              </div>
            </div>

            {/* Основная информация */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-3 mb-2'>
                <h1 className='text-2xl font-bold text-gray-900 truncate'>
                  Мгновенный заказ #{order.orderNumber}
                </h1>
                <Badge 
                  className={`${orderStatusColors[order.status]} text-white`}
                >
                  {orderStatusLabels[order.status] || order.status}
                </Badge>
                {order.subStatus && (
                  <Badge variant="outline">
                    {orderSubStatusLabels[order.subStatus] || order.subStatus}
                  </Badge>
                )}
              </div>

              <div className='flex items-center gap-2 text-gray-600 mb-2'>
                <Clock className='h-4 w-4 flex-shrink-0' />
                <span className='text-sm'>Создан: {formatDate(order.createdAt)}</span>
              </div>

              <div className='flex items-center gap-4 text-sm text-gray-500'>
                <div className='flex items-center gap-1'>
                  <MapPin className='h-4 w-4 flex-shrink-0' />
                  <span className='font-medium'>Маршрут:</span>
                  <span className='truncate'>
                    {startLocationLoading ? (
                      <Skeleton className='h-4 w-20 inline-block' />
                    ) : (
                      startLocation?.name || 'Не указано'
                    )} → {endLocationLoading ? (
                      <Skeleton className='h-4 w-20 inline-block' />
                    ) : (
                      endLocation?.name || 'Не указано'
                    )}
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <DollarSign className='h-4 w-4 flex-shrink-0' />
                  <span className='font-medium'>Стоимость:</span>
                  <span className={`font-semibold ${!order.finalPrice || order.finalPrice === 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {formatPrice(order.finalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
