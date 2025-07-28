import type { FieldErrors } from 'react-hook-form';

// Тип для статуса секции
type SectionStatus = 'complete' | 'warning' | 'error' | 'pending';

export interface CompanyDataFields {
  profile: {
    companyName: string;
    companyType: string;
    registrationNumber?: string | null;
    taxIdentifier?: string | null;
    legalAddress: string;
    contactEmail?: string | null;
    contactPhone?: string | null;
    website?: string | null;
  };
}

export function getCompanyDataStatus(
  profile: CompanyDataFields['profile'],
  errors: FieldErrors<{ profile: CompanyDataFields['profile'] }>,
  _isSubmitted: boolean,
): SectionStatus {
  const required = [profile.companyName, profile.companyType, profile.legalAddress];
  const optional = [profile.registrationNumber, profile.taxIdentifier, profile.contactPhone];
  const allRequiredFilled = required.every(v => v && String(v).length > 0);
  const allOptionalFilled = optional.every(v => v && String(v).length > 0);

  const hasErrors =
    errors.profile?.companyName ||
    errors.profile?.companyType ||
    errors.profile?.legalAddress ||
    errors.profile?.registrationNumber ||
    errors.profile?.taxIdentifier ||
    errors.profile?.contactPhone;

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

export function getCompanyDataErrors(
  profile: CompanyDataFields['profile'],
  errors: FieldErrors<{ profile: CompanyDataFields['profile'] }>,
  _isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.profile?.companyName?.message)
    errorList.push('Ошибка - Название компании: ' + errors.profile.companyName.message);
  if (errors.profile?.companyType?.message)
    errorList.push('Ошибка - Тип компании: ' + errors.profile.companyType.message);
  if (errors.profile?.legalAddress?.message)
    errorList.push('Ошибка - Юридический адрес: ' + errors.profile.legalAddress.message);
  if (errors.profile?.registrationNumber?.message)
    errorList.push('Ошибка - Регистрационный номер: ' + errors.profile.registrationNumber.message);
  if (errors.profile?.taxIdentifier?.message)
    errorList.push('Ошибка - Налоговый идентификатор: ' + errors.profile.taxIdentifier.message);
  if (errors.profile?.contactPhone?.message)
    errorList.push('Ошибка - Телефон: ' + errors.profile.contactPhone.message);

  const status = getCompanyDataStatus(profile, errors, _isSubmitted);

  if (status === 'warning') {
    const missingFields = [];

    if (!profile.registrationNumber) missingFields.push('регистрационный номер');
    if (!profile.taxIdentifier) missingFields.push('налоговый идентификатор');
    if (!profile.contactPhone) missingFields.push('телефон');
    if (missingFields.length > 0) {
      errorList.push(`Рекомендация: Укажите ${missingFields.join(', ')} для полной информации`);
    }
  }

  return errorList;
}
