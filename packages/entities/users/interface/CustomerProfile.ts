/**
 * Интерфейс CustomerProfile
 * @interface
 */
export interface CustomerProfile {
  registrationDate: string;
  totalOrders: number;
  favoriteAddresses: string[];
  paymentMethods: string[];
  rating: number;
}
