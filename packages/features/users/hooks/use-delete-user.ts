'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { usersApi } from '@shared/api/users';
import type { UserApi } from '@entities/users';

interface UseDeleteUserProps {
  onSuccess?: () => void;
}

export function useDeleteUser({ onSuccess }: UseDeleteUserProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserApi | null>(null);

  const openDeleteModal = (user: UserApi) => {
    setUserToDelete(user);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await usersApi.deleteUser(userToDelete.id);
      toast.success('Пользователь успешно удален');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при удалении пользователя';

      toast.error(errorMessage);
      throw error; // Пробрасываем ошибку для обработки в модальном окне
    }
  };

  const getDeleteModalProps = () => {
    if (!userToDelete) {
      return {
        title: '',
        description: '',
        itemName: '',
        warningText: '',
      };
    }

    const isOperatorOrAdmin = userToDelete.role === 'Operator' || userToDelete.role === 'Admin';
    
    return {
      title: 'Удалить пользователя',
      description: 'Вы уверены, что хотите удалить этого пользователя?',
      itemName: `${userToDelete.fullName} (${userToDelete.email})`,
      warningText: isOperatorOrAdmin 
        ? 'Операторы не могут удалять операторов или администраторов'
        : 'Будут удалены все связанные с пользователем данные',
    };
  };

  return {
    isModalOpen,
    userToDelete,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    getDeleteModalProps,
  };
}
