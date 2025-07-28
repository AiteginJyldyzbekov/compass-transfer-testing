/**
 * Параметры для получения списка поездок
 * @interface
 */
export interface GetRidesParams {
  page?: number;
  limit?: number;
  driverId?: string;
  customerId?: string;
  status?: 'pending' | 'accepted' | 'started' | 'completed' | 'cancelled';
  dateFrom?: string;
  dateTo?: string;
  minPrice?: number;
  maxPrice?: number;
}
