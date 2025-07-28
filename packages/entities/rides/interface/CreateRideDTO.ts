/**
 * Интерфейс для создания поездки
 * @interface
 */
export interface CreateRideDTO {
  orderId: string;
  driverId: string;
  customerId: string;
  pickupLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  dropoffLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  estimatedDistance: number;
  estimatedDuration: number;
  estimatedPrice: number;
}
