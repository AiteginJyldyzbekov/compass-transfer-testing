/**
 * Данные для отслеживания поездки
 * @interface
 */
export interface RideTrackingData {
  rideId: string;
  driverLocation: {
    latitude: number;
    longitude: number;
    heading: number;
    speed: number;
  };
  estimatedArrival: string;
  distanceToPickup?: number;
  distanceToDropoff?: number;
}
