import type { OrderServiceDTO } from './OrderServiceDTO';

/**
 * Интерфейс пассажира для создания заказа (без ID)
 */
export interface CreatePassengerDTO {
  customerId?: string | null;
  firstName: string;
  lastName?: string | null;
  isMainPassenger: boolean;
}

/**
 * Интерфейс для создания запланированного заказа
 */
export interface CreateScheduledOrderDTO {
  /** ID тарифа */
  tariffId: string;

  /** ID готового маршрута (опционально) */
  routeId?: string | null;

  /** ID начальной точки (опционально, если не используется routeId) */
  startLocationId?: string | null;

  /** ID конечной точки (опционально, если не используется routeId) */
  endLocationId?: string | null;

  /** Промежуточные точки (ID локаций) */
  additionalStops: string[];

  /** Дополнительные услуги */
  services: OrderServiceDTO[];

  /** Предварительная стоимость */
  initialPrice: number;

  /** Запланированное время */
  scheduledTime: string;

  /** Информация о пассажирах */
  passengers: CreatePassengerDTO[];
}
