import type { OrderServiceDTO } from './OrderServiceDTO';

/**
 * Интерфейс для создания базового заказа
 * @interface CreateGenericOrderDTO
 */
export interface CreateGenericOrderDTO {
  tariffId: string;
  routeId: string;
  services: OrderServiceDTO;
  initialPrice: number;
}
