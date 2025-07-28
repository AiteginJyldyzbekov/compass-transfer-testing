/**
 * `SearchingDriver` = Поиск водителя<br>`DriverAssigned` = водитель назначен<br>`DriverHeading` = водитель едет к клиенту<br>`DriverArrived` = водитель прибыл на место посадки<br>`RideStarted` = клиент сел в машину, поездка началась<br>`RideFinished` = поездка завершена, клиент доставлен<br>`PaymentPending` = Ожидание оплаты<br>`PaymentCompleted` = Оплата выполнена<br>`ReviewPending` = Ожидание отзыва<br>`CancelledByClient` = Отменено клиентом<br>`CancelledByDriver` = Отменено водителем<br>`CancelledBySystem` = Отменено системой<br>`CancelledByOperator` = Отменено оператором
 * @enum
 */
export enum OrderSubStatus {
  SearchingDriver = 'SearchingDriver',
  DriverAssigned = 'DriverAssigned',
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