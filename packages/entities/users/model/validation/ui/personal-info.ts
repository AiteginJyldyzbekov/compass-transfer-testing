import type { FieldErrors } from 'react-hook-form';

// Тип для статуса секции
type SectionStatus = 'complete' | 'warning' | 'error' | 'pending';

export interface PersonalInfoFields {
  profile: {
    dateOfBirth: string;
    birthPlace?: string | null;
    citizenship: string;
    citizenshipCountry?: string;
    languages: string[];
    taxIdentifier?: string | null;
  };
}

export function getPersonalInfoStatus(
  profile: PersonalInfoFields['profile'],
  errors: FieldErrors<{ profile: PersonalInfoFields['profile'] }>,
  isSubmitted: boolean,
): SectionStatus {
  const required = [profile.dateOfBirth, profile.citizenship, profile.languages];
  const allRequiredFilled = required.every(v =>
    Array.isArray(v) ? v.length > 0 : v && String(v).length > 0,
  );
  const hasErrors =
    errors.profile?.dateOfBirth || errors.profile?.citizenship || errors.profile?.languages;

  if (hasErrors) return 'error';
  if (allRequiredFilled) return 'complete';

  // Если форма была отправлена и не все обязательные поля заполнены - показываем ошибку
  if (isSubmitted && !allRequiredFilled) return 'error';

  if (required.some(v => (Array.isArray(v) ? v.length > 0 : v && String(v).length > 0)))
    return 'pending';

  return 'pending';
}

export function getPersonalInfoErrors(
  profile: PersonalInfoFields['profile'],
  errors: FieldErrors<{ profile: PersonalInfoFields['profile'] }>,
  _isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.profile?.dateOfBirth?.message) errorList.push(errors.profile.dateOfBirth.message);
  if (errors.profile?.citizenship?.message) errorList.push(errors.profile.citizenship.message);
  if (errors.profile?.languages?.message) errorList.push(errors.profile.languages.message);

  return errorList;
}
