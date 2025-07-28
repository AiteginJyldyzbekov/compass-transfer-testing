import { Role } from './enums';
import type { GetUserBasicDTO } from './interface';

// Алиасы для совместимости с существующим кодом
export type UserApi = GetUserBasicDTO;
export const UserRole = Role;
export type UserRoleType = Role;

// Enum для сортировки
export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

// Интерфейс для фильтров пользователей
export interface UserFilters {
  role?: string;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}
