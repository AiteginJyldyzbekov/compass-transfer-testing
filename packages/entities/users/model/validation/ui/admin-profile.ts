import type { FieldErrors } from 'react-hook-form';
import type { AdminProfile } from '@entities/users/interface';

// Тип для статуса секции
type SectionStatus = 'complete' | 'warning' | 'error' | 'pending';

// Расширенный интерфейс для валидации (включает employeeId)
export interface AdminProfileFields extends AdminProfile {
  employeeId?: string;
}

/**
 * Получает статус секции профиля администратора
 */
export function getAdminProfileStatus(
  profile: AdminProfileFields,
  errors: FieldErrors<{ profile: AdminProfileFields }>,
  _isSubmitted: boolean,
): SectionStatus {
  const required = [profile.accessLevel];
  const optional = [profile.department, profile.position, profile.employeeId];
  const allRequiredFilled = required.every(v => v && String(v).length > 0);
  const allOptionalFilled = optional.every(v => v && String(v).length > 0);
  const hasErrors =
    errors.profile?.accessLevel ||
    errors.profile?.department ||
    errors.profile?.position ||
    errors.profile?.employeeId;

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

/**
 * Получает ошибки секции профиля администратора
 */
export function getAdminProfileErrors(
  profile: AdminProfileFields,
  errors: FieldErrors<{ profile: AdminProfileFields }>,
  _isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.profile?.accessLevel?.message)
    errorList.push('Ошибка - Уровень доступа: ' + errors.profile.accessLevel.message);
  if (errors.profile?.department?.message)
    errorList.push('Ошибка - Отдел: ' + errors.profile.department.message);
  if (errors.profile?.position?.message)
    errorList.push('Ошибка - Должность: ' + errors.profile.position.message);
  if (errors.profile?.employeeId?.message)
    errorList.push('Ошибка - Табельный номер: ' + errors.profile.employeeId.message);

  const status = getAdminProfileStatus(profile, errors, _isSubmitted);

  if (status === 'warning') {
    if (!profile.department) errorList.push('Рекомендация: Укажите отдел для лучшей организации');
    if (!profile.position)
      errorList.push('Рекомендация: Укажите должность для уточнения обязанностей');
    if (!profile.employeeId) errorList.push('Рекомендация: Укажите табельный номер для учета');
  }

  return errorList;
}
