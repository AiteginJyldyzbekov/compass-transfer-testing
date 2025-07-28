import type { FieldErrors } from 'react-hook-form';

// Тип для статуса секции
type SectionStatus = 'complete' | 'warning' | 'error' | 'pending';

export interface EmploymentFields {
  profile: {
    employment: {
      companyName: string;
      employmentType: string;
    };
  };
}

export function getEmploymentStatus(
  profile: EmploymentFields['profile'],
  errors: FieldErrors<{ profile: EmploymentFields['profile'] }>,
  _isSubmitted: boolean,
): SectionStatus {
  // Add null checking for employment object
  if (!profile?.employment) {
    return 'pending';
  }

  const required = [profile.employment.companyName, profile.employment.employmentType];
  const allRequiredFilled = required.every(v => v && String(v).length > 0);
  const hasErrors =
    errors.profile?.employment?.companyName || errors.profile?.employment?.employmentType;

  if (hasErrors) return 'error';
  if (allRequiredFilled) return 'complete';
  if (required.some(v => v && String(v).length > 0)) return 'pending';

  return 'pending';
}

export function getEmploymentErrors(
  profile: EmploymentFields['profile'],
  errors: FieldErrors<{ profile: EmploymentFields['profile'] }>,
  _isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.profile?.employment?.companyName?.message)
    errorList.push(errors.profile.employment.companyName.message);
  if (errors.profile?.employment?.employmentType?.message)
    errorList.push(errors.profile.employment.employmentType.message);

  return errorList;
}
