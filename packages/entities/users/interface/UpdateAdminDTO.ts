import type { AdminProfile } from '@entities/users/interface/AdminProfile';

/**
 * Интерфейс UpdateAdminDTO
 * @interface
 */
export interface UpdateAdminDTO {
  phoneNumber?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  profile: AdminProfile;
}