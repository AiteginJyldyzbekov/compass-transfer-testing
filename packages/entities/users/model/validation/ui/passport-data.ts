import type { FieldErrors } from 'react-hook-form';

// Тип для статуса секции
type SectionStatus = 'complete' | 'warning' | 'error' | 'pending';

export interface PassportDataFields {
  profile: {
    passport: {
      number: string;
      series?: string | null;
      issueDate?: string | null;
      issuedBy?: string | null;
      page?: number | null;
      expiryDate?: string | null;
      identityType: string;
    };
  };
}

export function getPassportDataStatus(
  profile: PassportDataFields['profile'],
  errors: FieldErrors<{ profile: PassportDataFields['profile'] }>,
  isSubmitted: boolean,
): SectionStatus {
  const required = [profile.passport.number, profile.passport.identityType];
  const allRequiredFilled = required.every(v => v && String(v).length > 0);
  const hasErrors = errors.profile?.passport?.number || errors.profile?.passport?.identityType;

  if (hasErrors) return 'error';
  if (allRequiredFilled) return 'complete';

  // Если форма была отправлена и не все обязательные поля заполнены - показываем ошибку
  if (isSubmitted && !allRequiredFilled) return 'error';

  if (required.some(v => v && String(v).length > 0)) return 'pending';

  return 'pending';
}

export function getPassportDataErrors(
  profile: PassportDataFields['profile'],
  errors: FieldErrors<{ profile: PassportDataFields['profile'] }>,
  _isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.profile?.passport?.number?.message)
    errorList.push(errors.profile.passport.number.message);
  if (errors.profile?.passport?.identityType?.message)
    errorList.push(errors.profile.passport.identityType.message);

  return errorList;
}
