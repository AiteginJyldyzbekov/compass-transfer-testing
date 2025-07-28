import type { RideWaypoint, RideStatus, OrderSubStatus } from '@entities/orders/enums';

/**
 * Интерфейс для получения информации о поездке
 * @interface GetRideDTO
 */
export interface GetRideDTO {
  orderId?: string | null;
  driverId: string;
  carId: string;
  waypoints: RideWaypoint;
  id: string;
  status: RideStatus;
  subStatus?: OrderSubStatus | null;
  driverArrivedAt?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
  passengerWaitingTime?: string | null;
  distance?: number | null;
  duration?: string | null;
}
