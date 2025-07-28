'use client';

import { useState } from 'react';
import { carsApi } from '@shared/api/cars';
import type { GetCarDTO } from '@entities/cars/interface';

interface UseDeleteCarProps {
  onSuccess?: () => void;
}

export function useDeleteCar({ onSuccess }: UseDeleteCarProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<GetCarDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openDeleteModal = (car: GetCarDTO) => {
    setCarToDelete(car);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setCarToDelete(null);
  };

  const confirmDelete = async () => {
    if (!carToDelete) return;

    setIsDeleting(true);
    try {
      await carsApi.deleteCar(carToDelete.id);
      closeDeleteModal();
      onSuccess?.();
    } catch (error) {
      console.error('Ошибка при удалении автомобиля:', error);
      // Здесь можно добавить toast уведомление об ошибке
    } finally {
      setIsDeleting(false);
    }
  };

  const getDeleteModalProps = () => ({
    title: 'Удалить автомобиль',
    description: carToDelete
      ? `Вы уверены, что хотите удалить автомобиль ${carToDelete.make} ${carToDelete.model} (${carToDelete.licensePlate})? Это действие нельзя отменить.`
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
