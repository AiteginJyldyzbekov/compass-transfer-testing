'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { OrderType } from '@entities/orders/enums/OrderType.enum';
import { useInstantOrderById } from '@entities/orders/hooks';
import { getOrderEditRoute } from '@entities/orders/utils/order-routes';
import { DeleteConfirmationModal } from '@shared/ui/modals/delete-confirmation-modal';
import { InstantOrderViewHeader } from './components/instant-order-view-header';
import { InstantOrderViewContent } from './components/instant-order-view-content';
import { InstantOrderViewActions } from './components/instant-order-view-actions';
import { InstantOrderViewLoading } from './components/instant-order-view-loading';
import { InstantOrderViewError } from './components/instant-order-view-error';

interface InstantOrderViewPageProps {
  orderId: string;
}

export function InstantOrderViewPage({ orderId }: InstantOrderViewPageProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
        description: `Мгновенный заказ #${order.orderNumber} был удален`
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
        itemName={order ? `Мгновенный заказ #${order.orderNumber}` : undefined}
        warningText="Удаление заказа может повлиять на связанные поездки и статистику."
      />
    </div>
  );
}
