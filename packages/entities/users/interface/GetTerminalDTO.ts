import type { Role, ActivityStatus } from '@entities/users/enums';
import type { TerminalProfile } from '@entities/users/interface/TerminalProfile';

/**
 * Интерфейс GetTerminalDTO
 * @interface
 */
export interface GetTerminalDTO {
  id: string;
  email: string;
  role: Role;
  phoneNumber?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  online?: boolean | null;
  lastActive?: string | null;
  status: ActivityStatus;
  locationId?: string | null;
  profile: TerminalProfile;
}