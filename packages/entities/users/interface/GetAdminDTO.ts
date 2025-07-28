import type { Role } from '@entities/users/enums';
import type { AdminProfile } from '@entities/users/interface/AdminProfile';

/**
 * Интерфейс GetAdminDTO
 * @interface
 */
export interface GetAdminDTO {
  id: string;
  email: string;
  role: Role;
  phoneNumber?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  online?: boolean | null;
  profile: AdminProfile;
}