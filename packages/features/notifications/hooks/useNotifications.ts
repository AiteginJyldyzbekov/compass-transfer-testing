'use client'

import { useState, useCallback, useRef } from 'react';
import { notificationsApi, type GetNotificationDTO, type NotificationApiResponse } from '@shared/api/notifications';
import { logger } from '@shared/lib/logger';

export interface UseNotificationsResult {
  notifications: GetNotificationDTO[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  unreadCount: number;
  actions: {
    loadNotifications: (append?: boolean) => Promise<void>;
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
  };
}

/**
 * Хук для работы с уведомлениями
 * Использует notification-service для API вызовов
 */
export function useNotifications(pageSize: number = 20): UseNotificationsResult {
  // Состояние
  const [notifications, setNotifications] = useState<GetNotificationDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Курсор для пагинации
  const lastCursorRef = useRef<string | undefined>(undefined);

  // Загрузка уведомлений
  const loadNotifications = useCallback(
    async (append: boolean = false) => {
      try {
        if (append) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
          lastCursorRef.current = undefined; // Сбрасываем курсор для новой загрузки
        }
        setError(null);

        // Используем cursor-based пагинацию
        const result: NotificationApiResponse = await notificationsApi.getNotifications({
          size: pageSize,
          after: append ? lastCursorRef.current : undefined,
        });

        const newNotifications = result.data || [];

        if (append) {
          setNotifications(prev => [...prev, ...newNotifications]);
        } else {
          setNotifications(newNotifications);
        }

        setTotalCount(result.totalCount || 0);
        setHasMore(result.hasNext || false);

        // Обновляем курсор
        if (newNotifications.length > 0) {
          const newCursor = newNotifications[newNotifications.length - 1].id;

          lastCursorRef.current = newCursor;
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки уведомлений';

        logger.error('❌ useNotifications ошибка:', err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [pageSize],
  );

  // Загрузка следующей страницы
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || isLoading) {

      return;
    }

    await loadNotifications(true);
  }, [hasMore, isLoadingMore, isLoading, loadNotifications]);

  // Обновление списка
  const refresh = useCallback(async () => {
    await loadNotifications(false);
  }, [loadNotifications]);

  // Отметить как прочитанное
  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationsApi.markAsRead([id]);

      // Обновляем локальное состояние
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, isRead: true } : notification,
        ),
      );

    } catch (err) {
      logger.error('❌ useNotifications.markAsRead ошибка:', err);
      throw err;
    }
  }, []);

  // Удалить уведомление
  const deleteNotification = useCallback(async (id: string) => {
    try {
      await notificationsApi.deleteNotification(id);

      // Обновляем локальное состояние
      setNotifications(prev => prev.filter(notification => notification.id !== id));

      logger.info('🗑️ useNotifications.deleteNotification успешно:', id);
    } catch (err) {
      logger.error('❌ useNotifications.deleteNotification ошибка:', err);
      throw err;
    }
  }, []);

  // Подсчет непрочитанных
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return {
    notifications,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    totalCount,
    unreadCount,
    actions: {
      loadNotifications,
      loadMore,
      refresh,
      markAsRead,
      deleteNotification,
    },
  };
}
