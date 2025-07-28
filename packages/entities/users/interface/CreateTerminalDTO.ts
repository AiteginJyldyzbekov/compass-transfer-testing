import type { ActivityStatus } from '@entities/users/enums';
import type { TerminalProfile } from '@entities/users/interface/TerminalProfile';

/**
 * Интерфейс CreateTerminalDTO
 * @interface
 */
export interface CreateTerminalDTO {
  phoneNumber?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  status: ActivityStatus;
  locationId?: string | null;
  profile: TerminalProfile;
  email: string;
  password: string;
}