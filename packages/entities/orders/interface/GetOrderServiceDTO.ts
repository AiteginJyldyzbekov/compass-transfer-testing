/**
 * Интерфейс GetOrderServiceDTO
 * @interface
 */
export interface GetOrderServiceDTO {
  /**
   * Идентификатор услуги
   */
  serviceId: string;
  
  /**
   * Количество единиц услуги
   */
  quantity: number;
  
  /**
   * Примечания к услуге в заказе
   */
  notes?: string | null;
  
  /**
   * Название услуги
   */
  name: string;
}
