'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ordersApi } from '@shared/api/orders';
import type { GetOrderDTO } from '@entities/orders';

interface UseDeleteOrderProps {
  onSuccess?: () => void;
}

export function useDeleteOrder({ onSuccess }: UseDeleteOrderProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<GetOrderDTO | null>(null);

  const openDeleteModal = (order: GetOrderDTO) => {
    setOrderToDelete(order);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setOrderToDelete(null);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      await ordersApi.deleteOrder(orderToDelete.id);
      toast.success(`Заказ "${orderToDelete.orderNumber}" удален`);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('Ошибка при удалении заказа:');
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при удалении заказа';

      toast.error(errorMessage);
      throw error; // Пробрасываем ошибку для обработки в модальном окне
    }
  };

  const getDeleteModalProps = () => {
    if (!orderToDelete) {
      return {
        title: '',
        description: '',
        itemName: '',
        warningText: '',
      };
    }

    return {
      title: 'Удалить заказ',
      description: 'Вы уверены, что хотите удалить этот заказ?',
      itemName: `Заказ №${orderToDelete.orderNumber}`,
      warningText: 'Будут удалены все связанные с заказом данные',
    };
  };

  return {
    isModalOpen,
    orderToDelete,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    getDeleteModalProps,
  };
}
