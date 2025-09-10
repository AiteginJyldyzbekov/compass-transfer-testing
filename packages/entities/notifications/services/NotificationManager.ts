/**
 * Менеджер уведомлений
 */
import { toast } from '@shared/lib/conditional-toast';
import type { NotificationHandler } from '@shared/hooks/signal/interface/NotificationHandler';
import { logger } from '@shared/lib/logger';

// Интерфейс для сообщения уведомления
interface NotificationMessage {
  title?: string;
  content?: string;
  [key: string]: unknown;
}

/**
 * Менеджер для обработки SignalR уведомлений
 */
export class NotificationManager {
  private handlers = new Map<string, NotificationHandler<NotificationMessage>[]>();

  /**
   * Регистрирует обработчик для типа уведомления
   */
  registerHandler(type: string, handler: NotificationHandler<NotificationMessage>) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    this.handlers.get(type)!.push(handler);
  }

  /**
   * Обрабатывает входящее уведомление
   */
  handleNotification(type: string, data: unknown) {
    logger.info('📢 Обработка уведомления:', { type, data });
    const handlers = this.handlers.get(type);

    if (handlers) {
      handlers.forEach(handler => handler(data as NotificationMessage));
    }
    // Показываем toast уведомление
    this.showToast(type, data as NotificationMessage);
  }

  /**
   * Показывает toast уведомление
   */
  private showToast(type: string, data: NotificationMessage) {
    const title = data.title || 'Уведомление';
    const content = data.content || '';

    switch (type) {
      case 'RideRequest':
      case 'RideRequestNotification':
        toast.info(`🚗 ${title}: ${content}`);
        break;
      case 'RideAccepted':
      case 'RideAcceptedNotification':
        toast.success(`✅ ${title}: ${content}`);
        break;
      case 'RideCancelled':
      case 'RideCancelledNotification':
        toast.warning(`❌ ${title}: ${content}`);
        break;
      case 'RideStarted':
      case 'RideStartedNotification':
        toast.success(`🚗 ${title}: ${content}`);
        // this.handleRideStarted(data);
        break;
      case 'DriverArrivedNotification':
        toast.success(`🏁 ${title}: ${content}`);
        break;
      case 'DriverHeadingNotification':
        toast.info(`🚗 ${title}: ${content}`);
        break;
      case 'DriverCancelledNotification':
        toast.error(`❌ ${title}: ${content}`);
        break;
      case 'OrderConfirmedNotification':
        toast.success(`✅ ${title}: ${content}`);
        break;
      case 'OrderCancelledNotification':
        toast.warning(`❌ ${title}: ${content}`, { type: 'order_cancelled' });
        break;
      case 'OrderCompletedNotification':
        toast.success(`🎉 ${title}: ${content}`, { type: 'order_success' });
        break;
      case 'RideRejectedNotification':
        toast.error(`❌ ${title}: ${content}`);
        break;
      case 'RideStartedNotification':
        toast.info(`🚀 ${title}: ${content}`);
        break;
      case 'PaymentNotification':
        toast.info(`💳 ${title}: ${content}`);
        break;
      case 'PaymentReceivedNotification':
        toast.success(`💰 ${title}: ${content}`, { type: 'payment_success' });
        break;
      case 'PaymentFailedNotification':
        toast.error(`💸 ${title}: ${content}`);
        break;
      default:
        toast.info(`📢 ${title}: ${content}`);
    }
  }
}
export const notificationManager = new NotificationManager();
