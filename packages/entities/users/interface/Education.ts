/**
 * Интерфейс Education
 * @interface
 */
export interface Education {
  institution: string;
  degree?: string | null;
  fieldOfStudy?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isCompleted: boolean;
}