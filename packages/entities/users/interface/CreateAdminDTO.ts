import type { AdminProfile } from '@entities/users/interface/AdminProfile';

/**
 * Интерфейс CreateAdminDTO
 * @interface
 */
export interface CreateAdminDTO {
  phoneNumber?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  profile: AdminProfile;
  email: string;
  password: string;
}