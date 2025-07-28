/**
 * Интерфейс CreateCustomerDTO
 * @interface
 */
export interface CreateCustomerDTO {
  phoneNumber?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  loyaltyPoints: number;
  email: string;
  password: string;
}