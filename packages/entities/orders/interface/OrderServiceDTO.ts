/**
 * Интерфейс для дополнительной услуги в заказе
 * @interface OrderServiceDTO
 */
export interface OrderServiceDTO {
  serviceId: string;
  quantity: number;
  notes?: string | null;
}
