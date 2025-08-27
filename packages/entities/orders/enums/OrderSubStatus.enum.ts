export enum OrderSubStatus {
  SearchingDriver = 'SearchingDriver',
  DriverAssigned = 'DriverAssigned',
  DriverReady = 'DriverReady',
  DriverHeading = 'DriverHeading',
  DriverArrived = 'DriverArrived',
  RideStarted = 'RideStarted',
  RideFinished = 'RideFinished',
  PaymentPending = 'PaymentPending',
  PaymentCompleted = 'PaymentCompleted',
  ReviewPending = 'ReviewPending',
  CancelledByClient = 'CancelledByClient',
  CancelledByDriver = 'CancelledByDriver',
  CancelledBySystem = 'CancelledBySystem',
  CancelledByOperator = 'CancelledByOperator',
}
/**
 * Массив всех значений OrderSubStatus
 */
export const OrderSubStatusValues = [
  OrderSubStatus.SearchingDriver,
  OrderSubStatus.DriverAssigned,
  OrderSubStatus.DriverHeading,
  OrderSubStatus.DriverArrived,
  OrderSubStatus.RideStarted,
  OrderSubStatus.RideFinished,
  OrderSubStatus.PaymentPending,
  OrderSubStatus.PaymentCompleted,
  OrderSubStatus.ReviewPending,
  OrderSubStatus.CancelledByClient,
  OrderSubStatus.CancelledByDriver,
  OrderSubStatus.CancelledBySystem,
  OrderSubStatus.CancelledByOperator,
];