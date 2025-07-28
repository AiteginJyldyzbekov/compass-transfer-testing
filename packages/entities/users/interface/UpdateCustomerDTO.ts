/**
 * Интерфейс UpdateCustomerDTO
 * @interface
 */
export interface UpdateCustomerDTO {
  phoneNumber?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  loyaltyPoints: number;
}