'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { notificationsApi, type GetNotificationDTO } from '@shared/api/notifications';

interface UseNotificationActionsProps {
  onSuccess?: () => void;
}

export function useNotificationActions({ onSuccess }: UseNotificationActionsProps = {}) {
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleReadStatus = async (notification: GetNotificationDTO) => {
    setIsUpdating(true);
    try {
      // Новый API работает только с отметкой как прочитанные
      // Если уведомление уже прочитано, ничего не делаем
      if (!notification.isRead) {
        await notificationsApi.markAsRead([notification.id]);
        toast.success('Уведомление отмечено как прочитанное');
        onSuccess?.();
      }
    } catch {
      toast.error('Ошибка при изменении статуса уведомления');
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    toggleReadStatus,
    isUpdating,
  };
}
