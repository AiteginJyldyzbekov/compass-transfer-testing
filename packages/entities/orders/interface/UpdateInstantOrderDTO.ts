import type { OrderStatus } from '@entities/orders/enums';
import type { OrderServiceDTO } from './OrderServiceDTO';

/**
 * Интерфейс для обновления мгновенного заказа
 * @interface UpdateInstantOrderDTO
 */
export interface UpdateInstantOrderDTO {
  tariffId: string;
  routeId?: string | null;
  services: OrderServiceDTO[];
  initialPrice: number;
  status: OrderStatus;
}
