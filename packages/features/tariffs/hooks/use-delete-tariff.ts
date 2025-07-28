'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { tariffsApi, type GetTariffDTOWithArchived } from '@shared/api/tariffs';

interface UseDeleteTariffProps {
  onSuccess?: () => void;
}

export function useDeleteTariff({ onSuccess }: UseDeleteTariffProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tariffToDelete, setTariffToDelete] = useState<GetTariffDTOWithArchived | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteModal = (tariff: GetTariffDTOWithArchived) => {
    setTariffToDelete(tariff);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setTariffToDelete(null);
  };

  const confirmDelete = async () => {
    if (!tariffToDelete) return;

    setIsDeleting(true);
    try {
      await tariffsApi.deleteTariff(tariffToDelete.id);
      toast.success(`Тариф "${tariffToDelete.name}" удален`);
      closeDeleteModal();
      onSuccess?.();
    } catch (error) {
      console.error('Ошибка при удалении тарифа:', error);
      toast.error('Ошибка при удалении тарифа');
    } finally {
      setIsDeleting(false);
    }
  };

  const getDeleteModalProps = () => ({
    title: 'Удалить тариф',
    description: tariffToDelete
      ? `Вы уверены, что хотите удалить тариф "${tariffToDelete.name}"? Это действие нельзя отменить.`
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
