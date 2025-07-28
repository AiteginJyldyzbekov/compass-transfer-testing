'use client';

import { useState } from 'react';
import { servicesApi } from '@shared/api/services';
import type { GetServiceDTO } from '@entities/services/interface/GetServiceDTO';

interface UseDeleteServiceProps {
  onSuccess?: () => void;
}

export function useDeleteService({ onSuccess }: UseDeleteServiceProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<GetServiceDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteModal = (service: GetServiceDTO) => {
    setServiceToDelete(service);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setServiceToDelete(null);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;

    setIsDeleting(true);
    try {
      await servicesApi.deleteService(serviceToDelete.id);
      closeDeleteModal();
      onSuccess?.();
    } catch (error) {
      console.error('Ошибка при удалении услуги:', error);
      // Здесь можно добавить toast уведомление об ошибке
    } finally {
      setIsDeleting(false);
    }
  };

  const getDeleteModalProps = () => ({
    title: 'Удалить услугу',
    description: serviceToDelete
      ? `Вы уверены, что хотите удалить услугу "${serviceToDelete.name}"? Это действие нельзя отменить.`
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
