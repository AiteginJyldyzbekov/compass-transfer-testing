import type { EmploymentType } from '@entities/users/enums';

/**
 * Интерфейс Employment
 * @interface
 */
export interface Employment {
  companyName: string;
  employmentType: EmploymentType;
  percentage?: number | null;
  fixedAmount?: number | null;
}
