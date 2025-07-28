

/**
 * Обработчик уведомлений
 */
export interface NotificationHandler<T = NotificationMessage> {
    (data: T): void;
  }