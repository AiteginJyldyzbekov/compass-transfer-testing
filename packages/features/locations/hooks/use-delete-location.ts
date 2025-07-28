'use client';

import { useState } from 'react';
import { locationsApi } from '@shared/api/locations';
import type { LocationDTO } from '@entities/locations/interface/LocationDTO';

interface UseDeleteLocationProps {
  onSuccess?: () => void;
}

export function useDeleteLocation({ onSuccess }: UseDeleteLocationProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<LocationDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteModal = (location: LocationDTO) => {
    setLocationToDelete(location);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setLocationToDelete(null);
  };

  const confirmDelete = async () => {
    if (!locationToDelete) return;

    setIsDeleting(true);
    try {
      await locationsApi.deleteLocation(locationToDelete.id);
      closeDeleteModal();
      onSuccess?.();
    } catch (error) {
      console.error('Ошибка при удалении локации:', error);
      // Здесь можно добавить toast уведомление об ошибке
    } finally {
      setIsDeleting(false);
    }
  };

  const getDeleteModalProps = () => ({
    title: 'Удалить локацию',
    description: locationToDelete
      ? `Вы уверены, что хотите удалить локацию "${locationToDelete.name}" (${locationToDelete.address})? Это действие нельзя отменить.`
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
