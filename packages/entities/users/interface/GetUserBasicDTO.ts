import type { Role } from '@entities/users/enums';

/**
 * Интерфейс GetUserBasicDTO
 * @interface
 */
export interface GetUserBasicDTO {
  id: string;
  email: string;
  role: Role;
  phoneNumber?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  online?: boolean | null;
}