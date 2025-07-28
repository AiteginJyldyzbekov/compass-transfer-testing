import { 
  Bell, 
  Package, 
  Car, 
  CreditCard, 
  Settings, 
  Gift, 
  Shield, 
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  Mail
} from 'lucide-react';
import type { NotificationType } from '../enums/NotificationType.enum';

/**
 * Иконки для типов уведомлений
 */
export const NotificationTypeIcons: Record<NotificationType, React.ComponentType<any>> = {
  Unknown: Bell,

  // Уведомления о заказах
  OrderCreated: Package,
  OrderUpdated: Package,
  OrderConfirmed: CheckCircle,
  OrderCancelled: AlertTriangle,
  OrderCompleted: CheckCircle,

  // Уведомления о поездках
  RideRequest: Car,
  RideAccepted: CheckCircle,
  RideRejected: AlertTriangle,
  RideStarted: Car,
  RideCompleted: CheckCircle,
  RideCancelled: AlertTriangle,
  RideUpdate: Car,

  // Уведомления о платежах
  Payment: CreditCard,
  PaymentReceived: CreditCard,
  PaymentFailed: AlertTriangle,
  PaymentRefunded: CreditCard,

  // Уведомления о водителях
  DriverHeading: Car,
  DriverArrived: Bell,
  DriverAssigned: Car,
  DriverCancelled: AlertTriangle,
  DriverNearby: Car,

  // Системные уведомления
  System: Settings,
  SystemMessage: Info,
  Maintenance: Settings,

  // Промо уведомления
  Promo: Gift,
  PromoOffer: Gift,

  // Верификация
  Verification: Shield,

  // Чат
  Chat: MessageCircle,
};

/**
 * Получить иконку для типа уведомления
 */
export const getNotificationTypeIcon = (type: NotificationType) => {
  return NotificationTypeIcons[type] || Bell;
};
