import type { OperatorProfile } from '@entities/users/interface/OperatorProfile';

/**
 * Интерфейс UpdateOperatorDTO
 * @interface
 */
export interface UpdateOperatorDTO {
  phoneNumber?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  isActive: boolean;
  profile: OperatorProfile;
}