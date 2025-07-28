/**
 * Интерфейс WorkExperience
 * @interface
 */
export interface WorkExperience {
  employerName: string;
  position: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  responsibilities: string | null;
}
