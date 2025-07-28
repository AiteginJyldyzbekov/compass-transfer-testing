import type { OrderServiceDTO } from './OrderServiceDTO';
import type { PassengerDTO } from './PassengerDTO';

/**
 * Интерфейс для создания мгновенного заказа
 * @interface CreateInstantOrderDTO
 */
export interface CreateInstantOrderDTO {
  tariffId: string;
  routeId?: string | null;
  startLocationId?: string | null;
  endLocationId?: string | null;
  additionalStops: string[];
  services: OrderServiceDTO[];
  initialPrice: number;
  passengers: PassengerDTO[];
  paymentId?: string;
}
