import { toast } from 'sonner';

/**
 * Простой event emitter для синхронизации уведомлений между компонентами
 */

type NotificationEventListener = () => void;

class NotificationsEventEmitter {
  private listeners: NotificationEventListener[] = [];

  // Подписаться на события обновления уведомлений
  subscribe(listener: NotificationEventListener): () => void {
    this.listeners.push(listener);

    // Возвращаем функцию для отписки
    return () => {
      const index = this.listeners.indexOf(listener);

      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Уведомить всех подписчиков об обновлении
  emit(): void {
    this.listeners.forEach(listener => {
      try {
        listener();
      } catch {
        toast.error('Ошибка при обновлении уведомлений');
      }
    });
  }
}

// Создаем глобальный экземпляр
export const notificationsEvents = new NotificationsEventEmitter();
