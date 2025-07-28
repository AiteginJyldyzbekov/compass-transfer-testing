import type { NotificationLocationDTO } from './NotificationLocationDTO';

/**
 * Интерфейс NotificationWaypointDTO
 * @interface
 */
export interface NotificationWaypointDTO {
  location: NotificationLocationDTO;
  arrivalTime?: string | null;
  departureTime?: string | null;
}