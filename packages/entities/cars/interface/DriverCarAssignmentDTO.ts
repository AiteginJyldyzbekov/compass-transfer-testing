/**
 * Интерфейс для назначения водителя на автомобиль
 * @interface
 */
export interface DriverCarAssignmentDTO {
  driverId: string;
  carId: string;
  isActive: boolean;
  assignedAt: string;
}
/**
 * Интерфейс для запроса назначения водителя
 * @interface
 */
export interface AssignDriverRequest {
  isActive: boolean;
}
/**
 * Интерфейс для водителя с базовой информацией
 * Соответствует ответу от GET /User/Driver/{uuid}
 * @interface
 */
export interface DriverBasicInfo {
  id: string;
  email: string;
  role: string;
  phoneNumber?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  online?: boolean | null;
  rating?: number | null;
  isAvailable: boolean;
  verificationStatus: string;
  activeCarId?: string | null;
  currentLocationId?: string | null;
  profile?: {
    licenseNumber?: string;
    licenseCategories?: string[];
    licenseIssueDate?: string;
    licenseExpiryDate?: string;
    dateOfBirth?: string;
    birthPlace?: string | null;
    citizenship?: string;
    citizenshipCountry?: string;
    drivingExperience?: number | null;
    languages?: string[];
    taxIdentifier?: string | null;
    totalRides?: number;
    totalDistance?: number;
    lastRideDate?: string | null;
    medicalExamDate?: string | null;
    backgroundCheckDate?: string | null;
    profilePhoto?: string | null;
    preferredRideTypes?: string[];
    preferredWorkZones?: string[];
    trainingCompleted?: boolean;
    passport?: {
      number?: string;
      series?: string | null;
      issueDate?: string | null;
      issuedBy?: string | null;
      page?: string | null;
      expiryDate?: string | null;
      identityType?: string;
    };
    workExperience?: Array<{
      employerName?: string;
      position?: string;
      startDate?: string;
      endDate?: string | null;
      isCurrent?: boolean;
      responsibilities?: string | null;
    }>;
    education?: Array<{
      institution?: string;
      degree?: string | null;
      fieldOfStudy?: string | null;
      startDate?: string | null;
      endDate?: string | null;
      isCompleted?: boolean;
    }>;
    testScore?: Array<{
      testName?: string;
      score?: number;
      maxPossibleScore?: number;
      passedDate?: string;
      expiryDate?: string | null;
      comments?: string | null;
    }>;
  };
}
/**
 * Интерфейс для списка водителей с пагинацией
 * @interface
 */
export interface DriversListResponse {
  data: DriverBasicInfo[];
  totalCount: number;
  pageSize: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
