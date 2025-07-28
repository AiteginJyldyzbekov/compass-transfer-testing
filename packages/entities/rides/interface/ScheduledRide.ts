/**
 * Интерфейсы для запланированных поездок
 */

/**
 * Статусы поездки
 * @type RideStatus
 */
export type RideStatus =
  | 'Requested'
  | 'Searching'
  | 'Accepted'
  | 'Arrived'
  | 'InProgress'
  | 'Completed'
  | 'Cancelled';

/**
 * Статусы заказа
 * @type OrderStatus
 */
export type OrderStatus =
  | 'Pending'
  | 'Scheduled'
  | 'InProgress'
  | 'Completed'
  | 'Cancelled'
  | 'Expired';

/**
 * Подстатусы заказа
 * @type OrderSubStatus
 */
export type OrderSubStatus =
  | 'SearchingDriver'
  | 'DriverAssigned'
  | 'DriverHeading'
  | 'DriverArrived'
  | 'RideStarted'
  | 'RideFinished'
  | 'PaymentPending'
  | 'PaymentCompleted'
  | 'ReviewPending'
  | 'CancelledByClient'
  | 'CancelledByDriver'
  | 'CancelledBySystem'
  | 'CancelledByOperator';

/**
 * Данные запланированной поездки
 * @interface ScheduledRideDTO
 */
export interface ScheduledRideDTO {
  /** ID поездки */
  id: string;
  /** ID связанного заказа */
  orderId: string | null;
  /** Статус поездки */
  status: RideStatus;
  /** Статус заказа */
  orderStatus: OrderStatus;
  /** Подстатус заказа */
  orderSubStatus: OrderSubStatus;
  /** Запланированное время выполнения */
  scheduledTime: string;
  /** Имя клиента (главного пассажира) */
  customerName: string | null;
  /** Адрес начальной точки */
  fromAddress: string;
  /** Адрес конечной точки */
  toAddress: string;
}

/**
 * Ответ API для запланированных поездок
 * @interface ScheduledRidesResponse
 */
export interface ScheduledRidesResponse {
  /** Массив поездок */
  data: ScheduledRideDTO[];
  /** Общее количество записей */
  totalCount: number;
  /** Размер страницы */
  pageSize: number;
  /** Есть ли предыдущая страница */
  hasPrevious: boolean;
  /** Есть ли следующая страница */
  hasNext: boolean;
}

/**
 * Параметры запроса для получения запланированных поездок
 * @interface ScheduledRidesParams
 */
export interface ScheduledRidesParams {
  /** Пагинация - первые записи */
  first?: boolean;
  /** Пагинация - до указанного курсора */
  before?: string;
  /** Пагинация - после указанного курсора */
  after?: string;
  /** Пагинация - последние записи */
  last?: boolean;
  /** Размер страницы */
  size?: number;
  /** Фильтр по ID заказа */
  orderId?: string;
  /** @deprecated Используйте orderStatus для фильтрации по статусам заказа */
  status?: RideStatus[];
  /** Фильтр по статусам заказа */
  orderStatus?: OrderStatus[];
  /** Фильтр по подстатусам заказа */
  orderSubStatus?: OrderSubStatus[];
  /** Фильтр по времени начала */
  startedAt?: string;
  /** Оператор сравнения для времени начала */
  startedAtOp?: 'GreaterThan' | 'GreaterThanOrEqual' | 'Equal' | 'LessThanOrEqual' | 'LessThan';
}

/**
 * Информация о пагинации
 * @interface PaginationInfo
 */
export interface PaginationInfo {
  totalCount: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
