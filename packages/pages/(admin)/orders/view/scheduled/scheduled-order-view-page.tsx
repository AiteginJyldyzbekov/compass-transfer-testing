'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { OrderType } from '@entities/orders/enums/OrderType.enum';
import { useGetScheduledOrder } from '@entities/orders/hooks';
import { getOrderEditRoute } from '@entities/orders/utils/order-routes';
import { DeleteConfirmationModal } from '@shared/ui/modals/delete-confirmation-modal';
import { ScheduledOrderViewHeader } from './components/scheduled-order-view-header';
import { ScheduledOrderViewContent } from './components/scheduled-order-view-content';
import { ScheduledOrderViewActions } from './components/scheduled-order-view-actions';
import { ScheduledOrderViewLoading } from './components/scheduled-order-view-loading';
import { ScheduledOrderViewError } from './components/scheduled-order-view-error';

interface ScheduledOrderViewPageProps {
  orderId: string;
}

export function ScheduledOrderViewPage({ orderId }: ScheduledOrderViewPageProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    order,
    isLoading,
    error
  } = useGetScheduledOrder(orderId);

  const handleBack = () => {
    router.push('/orders');
  };

  const handleEdit = () => {
    if (order) {
      router.push(getOrderEditRoute(order.id, OrderType.Scheduled));
    }
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!order) return;

    try {
      // TODO: Добавить API вызов для удаления заказа
      console.log('Удаление заказа:', order.id);

      // Показываем успешное уведомление
      toast.success('Заказ успешно удален', {
        description: `Запланированный заказ #${order.orderNumber} был удален`
      });

      // После успешного удаления перенаправляем на список заказов
      router.push('/orders');
    } catch (error) {
      // Показываем ошибку
      toast.error('Ошибка при удалении заказа', {
        description: error instanceof Error ? error.message : 'Произошла неизвестная ошибка'
      });
      throw error; // Перебрасываем ошибку, чтобы модальное окно не закрылось
    }
  };

  if (isLoading) {
    return <ScheduledOrderViewLoading />;
  }

  if (error || !order) {
    return (
      <ScheduledOrderViewError
        error={typeof error === 'string' ? error : 'Заказ с указанным ID не существует или был удален'}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className='pr-2 border rounded-2xl overflow-hidden shadow-sm h-full bg-white flex flex-col gap-6 p-6 overflow-y-auto'>
      {/* Заголовок */}
      <ScheduledOrderViewHeader order={order} />

      {/* Двухколоночный layout */}
      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        {/* Левая колонка - основная информация (3/4 ширины) */}
        <div className='lg:col-span-3'>
          <ScheduledOrderViewContent order={order} />
        </div>

        {/* Правая колонка - кнопки действий (1/4 ширины) */}
        <div className='lg:col-span-1'>
          <ScheduledOrderViewActions
            order={order}
            onEdit={handleEdit}
            onBack={handleBack}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Модальное окно подтверждения удаления */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Удалить заказ"
        description="Вы уверены, что хотите удалить этот заказ?"
        itemName={order ? `Запланированный заказ #${order.orderNumber}` : undefined}
        warningText="Удаление заказа может повлиять на связанные поездки и статистику."
      />
    </div>
  );
}
