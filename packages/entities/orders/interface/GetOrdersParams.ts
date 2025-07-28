/**
 * Параметры для получения списка заказов (согласно реальному API)
 * @interface GetOrdersParams
 */
export interface GetOrdersParams {
  // === Базовые параметры пагинации ===
  /** Получить первые записи */
  First?: boolean;

  /** Курсор для получения записей до указанной позиции */
  Before?: string;

  /** Курсор для получения записей после указанной позиции */
  After?: string;

  /** Получить последние записи */
  Last?: boolean;

  /** Размер страницы */
  Size?: number;

  // === Фильтры по типу и статусу ===
  /** Фильтр по типу заказа */
  Type?: string[];

  /** Фильтр по статусу заказа */
  status?: string[];

  /** Операция для фильтра статуса */
  statusOp?: 'Equals';

  /** Подстатус заказа */
  SubStatus?: string[];

  // === Фильтры по пользователям ===
  /** ID создателя заказа */
  CreatorId?: string;

  /** ID клиента (пассажира) */
  CustomerId?: string;

  // === Фильтры по времени ===
  /** Время создания заказа */
  CreatedAt?: string;

  /** Операция для фильтра времени создания */
  CreatedAtOp?: 'GreaterThan' | 'GreaterThanOrEqual' | 'Equal' | 'LessThanOrEqual' | 'LessThan';

  /** Время завершения заказа */
  CompletedAt?: string;

  /** Операция для фильтра времени завершения */
  CompletedAtOp?: 'GreaterThan' | 'GreaterThanOrEqual' | 'Equal' | 'LessThanOrEqual' | 'LessThan';

  /** Запланированное время выполнения */
  ScheduledTime?: string;

  /** Операция для фильтра запланированного времени */
  ScheduledTimeOp?: 'GreaterThan' | 'GreaterThanOrEqual' | 'Equal' | 'LessThanOrEqual' | 'LessThan';

  // === Дополнительные фильтры ===
  /** Дополнительные услуги */
  Services?: string[];

  /** Информация о рейсе */
  AirFlight?: string;

  /** Операция для фильтра рейса */
  AirFlightOp?:
    | 'Equals'
    | 'NotEquals'
    | 'Contains'
    | 'NotContains'
    | 'StartsWith'
    | 'EndsWith'
    | 'IsEmpty'
    | 'IsNotEmpty';

  // === Полнотекстовый поиск ===
  /** Полнотекстовый поиск (plain) */
  'FTS.Plain'?: string;

  /** Полнотекстовый поиск (query) */
  'FTS.Query'?: string;

  // === Сортировка ===
  /** Поле для сортировки */
  SortBy?: string;

  /** Порядок сортировки */
  SortOrder?: 'Asc' | 'Desc';
}

/**
 * Типы заказов (согласно реальному API)
 */
export const ORDER_TYPES = {
  UNKNOWN: 'Unknown',
  INSTANT: 'Instant',
  SCHEDULED: 'Scheduled',
  PARTNER: 'Partner',
  SHUTTLE: 'Shuttle',
  SUBSCRIPTION: 'Subscription',
} as const;

/**
 * Статусы заказов (согласно реальному API)
 */
export const ORDER_STATUSES = {
  PENDING: 'Pending',
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'InProgress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  EXPIRED: 'Expired',
} as const;

/**
 * Подстатусы заказов (согласно реальному API)
 */
export const ORDER_SUB_STATUSES = {
  SEARCHING_DRIVER: 'SearchingDriver',
  DRIVER_ASSIGNED: 'DriverAssigned',
  DRIVER_HEADING: 'DriverHeading',
  DRIVER_ARRIVED: 'DriverArrived',
  RIDE_STARTED: 'RideStarted',
  RIDE_FINISHED: 'RideFinished',
  PAYMENT_PENDING: 'PaymentPending',
  PAYMENT_COMPLETED: 'PaymentCompleted',
  REVIEW_PENDING: 'ReviewPending',
  CANCELLED_BY_CLIENT: 'CancelledByClient',
  CANCELLED_BY_DRIVER: 'CancelledByDriver',
  CANCELLED_BY_SYSTEM: 'CancelledBySystem',
  CANCELLED_BY_OPERATOR: 'CancelledByOperator',
} as const;

/**
 * Операторы для фильтров времени
 */
export const TIME_OPERATORS = {
  GREATER_THAN: 'GreaterThan',
  GREATER_THAN_OR_EQUAL: 'GreaterThanOrEqual',
  EQUAL: 'Equal',
  LESS_THAN_OR_EQUAL: 'LessThanOrEqual',
  LESS_THAN: 'LessThan',
} as const;

/**
 * Операторы для текстовых фильтров
 */
export const TEXT_OPERATORS = {
  EQUALS: 'Equals',
  NOT_EQUALS: 'NotEquals',
  CONTAINS: 'Contains',
  NOT_CONTAINS: 'NotContains',
  STARTS_WITH: 'StartsWith',
  ENDS_WITH: 'EndsWith',
  IS_EMPTY: 'IsEmpty',
  IS_NOT_EMPTY: 'IsNotEmpty',
} as const;

/**
 * Направления сортировки (согласно реальному API)
 */
export const SORT_ORDER = {
  ASC: 'Asc',
  DESC: 'Desc',
} as const;
