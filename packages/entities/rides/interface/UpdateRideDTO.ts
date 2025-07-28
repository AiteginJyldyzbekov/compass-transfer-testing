import type { RideStatus } from '@entities/order/enums';
import type { RideWaypoint } from '@entities/order/interface/CreateScheduledRideDTO';

/**
 * Интерфейс для обновления поездки
 * PUT /Ride/{uuid}
 * @interface
 */
export interface UpdateRideDTO {
  /** Ссылка на связанный заказ (если есть) */
  orderId?: string | null;

  /** ID водителя */
  driverId: string;

  /** ID автомобиля */
  carId: string;

  /** Статус поездки */
  status: RideStatus;

  /** Промежуточные точки маршрута поездки */
  waypoints: RideWaypoint[];
}

/**
 * Интерфейс для частичного обновления поездки
 * @interface
 */
export interface UpdateRidePartialDTO {
  status?: 'pending' | 'accepted' | 'started' | 'completed' | 'cancelled';
  actualDistance?: number;
  actualDuration?: number;
  actualPrice?: number;
  rating?: number;
  feedback?: string;
}
