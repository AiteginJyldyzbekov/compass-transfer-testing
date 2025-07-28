/**
 * Статистика поездок
 * @interface
 */
export interface RideStats {
  totalRides: number;
  completedRides: number;
  cancelledRides: number;
  averageRating: number;
  totalRevenue: number;
  averageDistance: number;
  averageDuration: number;
}
