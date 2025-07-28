import type { FieldErrors } from 'react-hook-form';
import { EmploymentType } from '@entities/users/enums';

// Тип для статуса секции
type SectionStatus = 'complete' | 'warning' | 'error' | 'pending';

// Тип для статуса секции
export interface DriverEmploymentFields {
  employment: {
    companyName: string;
    employmentType: string;
    percentage?: number | null;
    fixedAmount?: number | null;
  };
}

export function getDriverEmploymentStatus(
  formData: DriverEmploymentFields,
  errors: FieldErrors<DriverEmploymentFields>,
  isSubmitted: boolean,
): SectionStatus {
  // Add null checking for employment object
  if (!formData?.employment) {
    return 'pending';
  }

  const employment = formData.employment;
  const required = [employment.companyName, employment.employmentType];

  // Проверяем условно обязательные поля
  let conditionalFieldFilled = true;
  if (employment.employmentType === EmploymentType.Percentage) {
    conditionalFieldFilled = employment.percentage !== null && employment.percentage !== undefined;
  } else if (employment.employmentType === EmploymentType.FixedAmount) {
    conditionalFieldFilled = employment.fixedAmount !== null && employment.fixedAmount !== undefined;
  }

  const allRequiredFilled = required.every(v => v && String(v).length > 0) && conditionalFieldFilled;

  const hasErrors = errors.employment?.companyName ||
                   errors.employment?.employmentType ||
                   errors.employment?.percentage ||
                   errors.employment?.fixedAmount;

  if (hasErrors) return 'error';
  if (allRequiredFilled) return 'complete';

  // Если форма была отправлена и не все поля заполнены - показываем ошибку
  if (isSubmitted && !allRequiredFilled) return 'error';

  if (required.some(v => v && String(v).length > 0)) return 'pending';

  return 'pending';
}

export function getDriverEmploymentErrors(
  formData: DriverEmploymentFields,
  errors: FieldErrors<DriverEmploymentFields>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  // Add null checking for employment object
  if (!formData?.employment || !errors?.employment) {
    return errorList;
  }

  const employment = formData.employment;

  if (errors.employment?.companyName?.message)
    errorList.push(errors.employment.companyName.message);
  if (errors.employment?.employmentType?.message)
    errorList.push(errors.employment.employmentType.message);
  if (errors.employment?.percentage?.message)
    errorList.push(errors.employment.percentage.message);
  if (errors.employment?.fixedAmount?.message)
    errorList.push(errors.employment.fixedAmount.message);

  // Добавляем ошибки для незаполненных условно обязательных полей после попытки отправки
  if (isSubmitted) {
    if (!employment.companyName || employment.companyName.length === 0) {
      errorList.push('Название компании обязательно');
    }
    if (!employment.employmentType || employment.employmentType.length === 0) {
      errorList.push('Выберите тип занятости');
    }
    if (employment.employmentType === EmploymentType.Percentage &&
        (employment.percentage === null || employment.percentage === undefined)) {
      errorList.push('Укажите процент от выручки');
    }
    if (employment.employmentType === EmploymentType.FixedAmount &&
        (employment.fixedAmount === null || employment.fixedAmount === undefined)) {
      errorList.push('Укажите фиксированную сумму');
    }
  }

  return errorList;
}
