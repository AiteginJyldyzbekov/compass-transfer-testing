import type { GetOrderDTO } from './GetOrderDTO';

/**
 * Интерфейс для получения информации о запланированном заказе
 * Наследует все поля от GetOrderDTO и добавляет специфичные для запланированных заказов
 * @interface GetScheduledOrderDTO
 */
export interface GetScheduledOrderDTO extends GetOrderDTO {
  /**
   * Запланированное время выполнения (обязательно для запланированных заказов)
   */
  scheduledTime: string;
}
