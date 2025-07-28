import type { LocationType } from '../enums';

/**
 * Интерфейс NotificationLocationDTO
 * @interface
 */
export interface NotificationLocationDTO {
  id: string;
  type: LocationType;
  name: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}