/**
 * Безопасная типизация для SignalR событий
 */
import type {
  DriverArrivedNotificationDTO,
  DriverHeadingNotificationDTO,
  DriverCancelledNotificationDTO,
  OrderConfirmedNotificationDTO,
  OrderCancelledNotificationDTO,
  OrderCompletedNotificationDTO,
  RideRejectedNotificationDTO,
  RideStartedNotificationDTO,
  PaymentNotificationDTO,
  PaymentReceivedNotificationDTO,
  PaymentFailedNotificationDTO,
} from '@shared/hooks/signal/interface';

/**
 * Типы данных для различных SignalR событий
 */
export interface DriverActivityData {
  isActive: boolean;
  lastActiveAt: string;
  driverId: string;
}

export interface RideNotificationData {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  type: 'request' | 'accepted' | 'assigned' | 'cancelled' | 'completed';
}

export interface LocationUpdateData {
  driverId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

/**
 * Union тип всех возможных данных SignalR
 */
export type SignalREventData =
  | DriverActivityData
  | RideNotificationData
  | LocationUpdateData
  | DriverArrivedNotificationDTO
  | DriverHeadingNotificationDTO
  | DriverCancelledNotificationDTO
  | OrderConfirmedNotificationDTO
  | OrderCancelledNotificationDTO
  | OrderCompletedNotificationDTO
  | RideRejectedNotificationDTO
  | RideStartedNotificationDTO
  | PaymentNotificationDTO
  | PaymentReceivedNotificationDTO
  | PaymentFailedNotificationDTO
  | Record<string, unknown>; // Fallback для неизвестных событий

/**
 * Мапинг событий к их типам данных
 */
export interface SignalREventMap {
  DriverActivityUpdated: DriverActivityData;
  DriverArrivedNotification: DriverArrivedNotificationDTO;
  DriverHeadingNotification: DriverHeadingNotificationDTO;
  DriverCancelledNotification: DriverCancelledNotificationDTO;
  OrderConfirmedNotification: OrderConfirmedNotificationDTO;
  OrderCancelledNotification: OrderCancelledNotificationDTO;
  OrderCompletedNotification: OrderCompletedNotificationDTO;
  RideRejectedNotification: RideRejectedNotificationDTO;
  RideStartedNotification: RideStartedNotificationDTO;
  PaymentNotification: PaymentNotificationDTO;
  PaymentReceivedNotification: PaymentReceivedNotificationDTO;
  PaymentFailedNotification: PaymentFailedNotificationDTO;
  RideRequestNotification: RideNotificationData;
  RideAcceptedNotification: RideNotificationData;
  RideAssignedNotification: RideNotificationData;
  RideCancelledNotification: RideNotificationData;
  RideCompletedNotification: RideNotificationData;
  LocationUpdate: LocationUpdateData;
}

/**
 * Generic callback функция для типизированных событий
 */
export type SignalRCallback<T = SignalREventData> = (data: T) => void;

/**
 * Типизированный callback для конкретного события
 */
export type TypedSignalRCallback<K extends keyof SignalREventMap> = SignalRCallback<
  SignalREventMap[K]
>;

/**
 * Generic интерфейс для обработчиков событий
 */
export interface SignalREventHandler {
  <K extends keyof SignalREventMap>(event: K, callback: TypedSignalRCallback<K>): void;
  (event: string, callback: SignalRCallback): void; // Fallback
}


export enum NotificationType {
  Unknown = 'Unknown',
  OrderCreated = 'OrderCreated',
  OrderUpdated = 'OrderUpdated',
  OrderConfirmed = 'OrderConfirmed',
  OrderCancelled = 'OrderCancelled',
  OrderCompleted = 'OrderCompleted',
  RideRequest = 'RideRequest',
  RideAccepted = 'RideAccepted',
  RideRejected = 'RideRejected',
  RideStarted = 'RideStarted',
  RideCompleted = 'RideCompleted',
  RideCancelled = 'RideCancelled',
  RideUpdate = 'RideUpdate',
  Payment = 'Payment',
  PaymentReceived = 'PaymentReceived',
  PaymentFailed = 'PaymentFailed',
  PaymentRefunded = 'PaymentRefunded',
  DriverHeading = 'DriverHeading',
  DriverArrived = 'DriverArrived',
  DriverAssigned = 'DriverAssigned',
  DriverCancelled = 'DriverCancelled',
  DriverNearby = 'DriverNearby',
  System = 'System',
  SystemMessage = 'SystemMessage',
  Maintenance = 'Maintenance',
  Promo = 'Promo',
  PromoOffer = 'PromoOffer',
  Verification = 'Verification',
  Chat = 'Chat',
}