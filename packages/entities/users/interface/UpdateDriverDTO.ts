import type { VerificationStatus } from '@entities/users/enums';
import type { DriverProfile } from '@entities/users/interface/DriverProfile';
import type { Employment } from '@entities/users/interface/Employment';

/**
 * Интерфейс UpdateDriverDTO
 * @interface
 */
export interface UpdateDriverDTO {
  phoneNumber?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  verificationStatus: VerificationStatus;
  profile: DriverProfile;
  employment: Employment;
}
