import type { FieldErrors } from 'react-hook-form';

// Тип для статуса секции
type SectionStatus = 'complete' | 'warning' | 'error' | 'pending';

export interface BasicDataFields {
  fullName: string;
  email: string;
  phoneNumber?: string | null;
}

export interface BasicDataFormData {
  fullName: string;
  email: string;
  password: string;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
}

export function getBasicDataStatus(
  formData: BasicDataFormData,
  errors: FieldErrors<BasicDataFormData>,
  _isSubmitted: boolean,
): SectionStatus {
  const required = [formData.fullName, formData.email];
  const optional = [formData.phoneNumber];
  const allRequiredFilled = required.every(v => v && String(v).length > 0);
  const allOptionalFilled = optional.every(v => v && String(v).length > 0);

  const hasErrors = errors.fullName || errors.email || errors.phoneNumber;

  if (hasErrors) return 'error';
  if (allRequiredFilled && allOptionalFilled) return 'complete';
  if (allRequiredFilled) return 'warning';
  if (
    required.some(v => v && String(v).length > 0) ||
    optional.some(v => v && String(v).length > 0)
  )
    return 'pending';

  return 'pending';
}

export function getBasicDataErrors(
  formData: BasicDataFormData,
  errors: FieldErrors<BasicDataFormData>,
  _isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.fullName?.message) errorList.push(errors.fullName.message);
  if (errors.email?.message) errorList.push(errors.email.message);
  if (errors.phoneNumber?.message) errorList.push(errors.phoneNumber.message);

  const status = getBasicDataStatus(formData, errors, _isSubmitted);

  if (status === 'warning') {
    if (!formData.phoneNumber) {
      errorList.push('Рекомендация: Укажите номер телефона для лучшей связи');
    }
  }

  return errorList;
}
