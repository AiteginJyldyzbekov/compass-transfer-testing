import type { FieldErrors } from 'react-hook-form';

// Тип для статуса секции
type SectionStatus = 'complete' | 'warning' | 'error' | 'pending';

export interface DriverLicenseFields {
  profile: {
    licenseNumber: string;
    licenseCategories: string[];
    licenseIssueDate: string;
    licenseExpiryDate: string;
    drivingExperience?: number | null;
  };
}

export function getDriverLicenseStatus(
  profile: DriverLicenseFields['profile'],
  errors: FieldErrors<{ profile: DriverLicenseFields['profile'] }>,
  isSubmitted: boolean,
): SectionStatus {
  const required = [
    profile.licenseNumber,
    profile.licenseCategories,
    profile.licenseIssueDate,
    profile.licenseExpiryDate,
  ];
  const allRequiredFilled = required.every(v =>
    Array.isArray(v) ? v.length > 0 : v && String(v).length > 0,
  );
  const hasErrors =
    errors.profile?.licenseNumber ||
    errors.profile?.licenseCategories ||
    errors.profile?.licenseIssueDate ||
    errors.profile?.licenseExpiryDate;

  if (hasErrors) return 'error';
  if (allRequiredFilled) return 'complete';

  // Если форма была отправлена и не все обязательные поля заполнены - показываем ошибку
  if (isSubmitted && !allRequiredFilled) return 'error';

  if (required.some(v => (Array.isArray(v) ? v.length > 0 : v && String(v).length > 0)))
    return 'pending';

  return 'pending';
}

export function getDriverLicenseErrors(
  profile: DriverLicenseFields['profile'],
  errors: FieldErrors<{ profile: DriverLicenseFields['profile'] }>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.profile?.licenseNumber?.message) errorList.push(errors.profile.licenseNumber.message);
  if (errors.profile?.licenseCategories?.message)
    errorList.push(errors.profile.licenseCategories.message);
  if (errors.profile?.licenseIssueDate?.message)
    errorList.push(errors.profile.licenseIssueDate.message);
  if (errors.profile?.licenseExpiryDate?.message)
    errorList.push(errors.profile.licenseExpiryDate.message);
  if (errors.profile?.drivingExperience?.message) errorList.push(errors.profile.drivingExperience.message);

  // Добавляем ошибки для незаполненных обязательных полей после попытки отправки
  if (isSubmitted) {
    if (!profile.licenseNumber || String(profile.licenseNumber).length === 0) {
      errorList.push('Номер водительского удостоверения обязателен');
    }
    if (!Array.isArray(profile.licenseCategories) || profile.licenseCategories.length === 0) {
      errorList.push('Категории водительского удостоверения обязательны');
    }
    if (!profile.licenseIssueDate || String(profile.licenseIssueDate).length === 0) {
      errorList.push('Дата выдачи водительского удостоверения обязательна');
    }
    if (!profile.licenseExpiryDate || String(profile.licenseExpiryDate).length === 0) {
      errorList.push('Дата окончания водительского удостоверения обязательна');
    }
  }

  return errorList;
}
