import type { VerificationStatus } from '@entities/users/enums';
import type { DriverProfile } from '@entities/users/interface/DriverProfile';
import type { Employment } from '@entities/users/interface/Employment';

/**
 * Интерфейс CreateDriverDTO
 * @interface
 */
export interface CreateDriverDTO {
  phoneNumber?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  verificationStatus: VerificationStatus;
  profile: DriverProfile;
  employment: Employment;
  email: string;
  password: string;
}
