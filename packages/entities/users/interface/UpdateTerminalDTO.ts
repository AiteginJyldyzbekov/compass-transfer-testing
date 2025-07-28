import type { ActivityStatus } from '@entities/users/enums';
import type { TerminalProfile } from '@entities/users/interface/TerminalProfile';

/**
 * Интерфейс UpdateTerminalDTO
 * @interface
 */
export interface UpdateTerminalDTO {
  phoneNumber?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  status: ActivityStatus;
  locationId?: string | null;
  profile: TerminalProfile;
}