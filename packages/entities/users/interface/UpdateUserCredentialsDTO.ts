import type { Role } from '@entities/users/enums';

/**
 * Интерфейс UpdateUserCredentialsDTO
 * @interface
 */
export interface UpdateUserCredentialsDTO {
  email?: string | null;
  role?: Role;
  password?: string | null;
}