'use client';

import { ShoppingCart, RefreshCw } from 'lucide-react';
import { Button } from '@shared/ui/forms/button';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';
import { useMyOrders } from '@features/my-orders/hooks/use-my-orders';
import { OrdersList } from '@features/my-orders/ui/orders-list';

export function OrdersSection() {
  const {
    orders,
    totalCount,
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useMyOrders();

  const handleViewDetails = (_orderId: string) => {
    // Здесь будет логика перехода к детальному просмотру заказа
  };

  if (ordersError) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col items-center justify-center text-center space-y-4'>
            <ShoppingCart className='h-12 w-12 text-red-500' />
            <div className='space-y-2'>
              <h3 className='text-lg font-semibold'>Ошибка загрузки</h3>
              <p className='text-muted-foreground max-w-md'>{ordersError}</p>
            </div>
            <Button onClick={refetchOrders} variant='outline'>
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
            <ShoppingCart className='h-5 w-5' />
            Мои заказы
            {!ordersLoading && totalCount > 0 && (
              <span className='text-muted-foreground ml-2'>({totalCount})</span>
            )}
          </CardTitle>
          <Button onClick={refetchOrders} variant='outline' size='sm' disabled={ordersLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${ordersLoading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <OrdersList orders={orders} isLoading={ordersLoading} onViewDetails={handleViewDetails} />
      </CardContent>
    </Card>
  );
}
