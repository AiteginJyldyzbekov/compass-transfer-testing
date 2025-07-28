import type { Role } from '@entities/users/enums';

/**
 * Интерфейс GetCustomerDTO
 * @interface
 */
export interface GetCustomerDTO {
  id: string;
  email: string;
  role: Role;
  phoneNumber?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  online?: boolean | null;
  loyaltyPoints?: number;
  phantom?: boolean;
}