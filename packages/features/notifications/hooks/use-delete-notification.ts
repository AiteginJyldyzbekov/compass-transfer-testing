'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { notificationsApi, type GetNotificationDTO } from '@shared/api/notifications';

interface UseDeleteNotificationProps {
  onSuccess?: () => void;
}

export function useDeleteNotification({ onSuccess }: UseDeleteNotificationProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<GetNotificationDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteModal = (notification: GetNotificationDTO) => {
    setNotificationToDelete(notification);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setNotificationToDelete(null);
  };

  const confirmDelete = async () => {
    if (!notificationToDelete) return;

    setIsDeleting(true);
    try {
      await notificationsApi.deleteNotification(notificationToDelete.id);
      closeDeleteModal();
      onSuccess?.();
    } catch {
      toast.error('Ошибка при удалении уведомления:');
      // Здесь можно добавить toast уведомление об ошибке
    } finally {
      setIsDeleting(false);
    }
  };

  const getDeleteModalProps = () => ({
    title: 'Удалить уведомление',
    description: notificationToDelete
      ? `Вы уверены, что хотите удалить уведомление "${notificationToDelete.title}"? Это действие нельзя отменить.`
      : '',
    confirmText: 'Удалить',
    cancelText: 'Отмена',
    isLoading: isDeleting,
  });

  return {
    isModalOpen,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    getDeleteModalProps,
    isDeleting,
  };
}
