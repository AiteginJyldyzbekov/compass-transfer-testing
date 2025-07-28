import type { RideStatus } from '@entities/order/enums';

/**
 * Интерфейс для получения поездки
 * @interface
 */
export interface GetRideDTO {
  id: string;
  orderId?: string | null; // Ссылка на связанный заказ (если есть)
  driverId: string; // Водитель
  carId: string; // Автомобиль
  status: RideStatus;
  driverArrivedAt?: string | null; // Фактическое время прибытия водителя к клиенту
  startedAt?: string | null; // Фактическое время начала поездки
  endedAt?: string | null; // Фактическое время окончания поездки
  passengerWaitingTime?: string | null; // Фактическое время ожидания клиента
  distance?: number | null; // Фактическое расстояние поездки (км)
  duration?: string | null; // Фактическая длительность поездки
  waypoints: GetRideWaypointDTO[]; // Промежуточные точки маршрута поездки
}

/**
 * Интерфейс для промежуточной точки маршрута поездки
 */
export interface GetRideWaypointDTO {
  locationId?: string | null;
  location?: any; // Детальная информация о локации
  arrivalTime?: string | null;
  departureTime?: string | null;
}
