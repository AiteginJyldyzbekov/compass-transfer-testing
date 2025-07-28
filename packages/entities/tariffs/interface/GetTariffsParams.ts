/**
 * Параметры для получения списка тарифов
 * @interface
 */
export interface GetTariffsParams {
  page?: number;
  limit?: number;
  search?: string;
  serviceClass?: 'economy' | 'comfort' | 'business' | 'premium';
  isActive?: boolean;
  currency?: string;
  validAt?: string; // дата для проверки валидности тарифа
}
