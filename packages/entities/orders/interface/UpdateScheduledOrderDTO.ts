import type { OrderServiceDTO } from './OrderServiceDTO';
import type { PassengerDTO } from './PassengerDTO';

/**
 * Интерфейс для обновления запланированного заказа
 */
export interface UpdateScheduledOrderDTO {
  /** ID заказа для обновления */
  orderId: string;

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

  /** Информация о пассажирах (без ID, так как это данные для обновления) */
  passengers: PassengerDTO[];

  /** Статус заказа */
  status: string;
}
