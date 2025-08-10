'use client';

import { useRouter } from 'next/navigation';
import { OrderType } from '@entities/orders/enums/OrderType.enum';
import { useInstantOrderById } from '@entities/orders/hooks';
import { getOrderEditRoute } from '@entities/orders/utils/order-routes';
import { InstantOrderViewActions } from './components/instant-order-view-actions';
import { InstantOrderViewContent } from './components/instant-order-view-content';
import { InstantOrderViewError } from './components/instant-order-view-error';
import { InstantOrderViewHeader } from './components/instant-order-view-header';
import { InstantOrderViewLoading } from './components/instant-order-view-loading';

interface InstantOrderViewPageProps {
  orderId: string;
}

export function InstantOrderViewPage({ orderId }: InstantOrderViewPageProps) {
  const router = useRouter();

  const {
    order,
    isLoading,
    error
  } = useInstantOrderById(orderId);

  const handleBack = () => {
    router.push('/orders');
  };

  const handleEdit = () => {
    if (order) {
      router.push(getOrderEditRoute(order.id, OrderType.Instant));
    }
  };



  if (isLoading) {
    return <InstantOrderViewLoading />;
  }

  if (error || !order) {
    return (
      <InstantOrderViewError
        error={typeof error === 'string' ? error : 'Заказ с указанным ID не существует или был удален'}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className='pr-2 border rounded-2xl overflow-hidden shadow-sm h-full bg-white flex flex-col gap-6 p-6 overflow-y-auto'>
      {/* Заголовок */}
      <InstantOrderViewHeader order={order} />

      {/* Двухколоночный layout */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Левая колонка - основная информация (3/4 ширины) */}
        <div className='lg:col-span-3'>
          <InstantOrderViewContent order={order} />
        </div>

        {/* Правая колонка - кнопки действий (1/4 ширины) */}
        <div className='lg:col-span-1'>
          <InstantOrderViewActions
            order={order}
            onEdit={handleEdit}
            onBack={handleBack}
          />
        </div>
      </div>
    </div>
  );
}
