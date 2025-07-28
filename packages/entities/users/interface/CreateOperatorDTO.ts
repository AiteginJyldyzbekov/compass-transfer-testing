import type { OperatorProfile } from '@entities/users/interface/OperatorProfile';

/**
 * Интерфейс CreateOperatorDTO
 * @interface
 */
export interface CreateOperatorDTO {
  phoneNumber?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  isActive: boolean;
  profile: OperatorProfile;
  email: string;
  password: string;
}