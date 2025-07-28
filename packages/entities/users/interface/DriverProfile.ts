import type { CitizenshipCountry, ServiceClass } from '@entities/users/enums';
import type { Education } from '@entities/users/interface/Education';
import type { Passport } from '@entities/users/interface/Passport';
import type { TestScore } from '@entities/users/interface/TestScore';
import type { WorkExperience } from '@entities/users/interface/WorkExperience';

/**
 * Интерфейс DriverProfile
 * @interface
 */
export interface DriverProfile {
  licenseNumber: string;
  licenseCategories: Array<string>;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  dateOfBirth: string;
  birthPlace?: string | null;
  citizenship: string;
  citizenshipCountry?: CitizenshipCountry;
  drivingExperience?: number | null;
  languages: Array<string>;
  taxIdentifier?: string | null;
  totalRides: number;
  totalDistance: number;
  lastRideDate?: string | null;
  medicalExamDate?: string | null;
  backgroundCheckDate?: string | null;
  profilePhoto?: string | null;
  preferredRideTypes: ServiceClass[];
  preferredWorkZones?: Array<string>;
  trainingCompleted: boolean;
  passport: Passport;
  workExperience?: WorkExperience[];
  education?: Education[];
  testScore?: TestScore[];
}
