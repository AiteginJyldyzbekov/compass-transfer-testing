import type { FieldErrors } from 'react-hook-form';

// Тип для статуса секции
type SectionStatus = 'complete' | 'warning' | 'error' | 'pending';

export interface EmployeeProfileFields {
  profile: {
    employeeId: string;
    department: string;
    position: string;
    hireDate: string;
  };
}

export function getEmployeeProfileStatus(
  profile: EmployeeProfileFields['profile'],
  errors: FieldErrors<{ profile: EmployeeProfileFields['profile'] }>,
  _isSubmitted: boolean,
): SectionStatus {
  // Обязательные поля для корректной работы
  const required = [profile.employeeId, profile.department];
  // Необязательные поля (для статуса warning)
  const optional = [profile.position, profile.hireDate];
  
  const allRequiredFilled = required.every(v => v && String(v).length > 0);
  const allOptionalFilled = optional.every(v => v && String(v).length > 0);
  
  const hasErrors =
    errors.profile?.employeeId ||
    errors.profile?.department ||
    errors.profile?.position ||
    errors.profile?.hireDate;

  if (hasErrors) return 'error';
  if (allRequiredFilled && allOptionalFilled) return 'complete';
  if (allRequiredFilled) return 'warning'; // Все обязательные заполнены, но не все необязательные
  if (
    required.some(v => v && String(v).length > 0) ||
    optional.some(v => v && String(v).length > 0)
  )
    return 'pending';

  return 'pending';
}

export function getEmployeeProfileErrors(
  profile: EmployeeProfileFields['profile'],
  errors: FieldErrors<{ profile: EmployeeProfileFields['profile'] }>,
  _isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.profile?.employeeId?.message)
    errorList.push('Ошибка - Табельный номер: ' + errors.profile.employeeId.message);
  if (errors.profile?.department?.message)
    errorList.push('Ошибка - Отдел: ' + errors.profile.department.message);
  if (errors.profile?.position?.message)
    errorList.push('Ошибка - Должность: ' + errors.profile.position.message);
  if (errors.profile?.hireDate?.message)
    errorList.push('Ошибка - Дата найма: ' + errors.profile.hireDate.message);

  return errorList;
}
