import type { FieldErrors } from 'react-hook-form';

// Тип для статуса секции
type SectionStatus = 'complete' | 'warning' | 'error' | 'pending';

// Временный тип для логики паролей (нужно будет найти правильный импорт)
type UsePasswordLogicReturn = {
  confirmPassword: string;
};

export interface SecurityFormData {
  password: string;
}

export function getSecurityStatus(
  formData: SecurityFormData,
  errors: FieldErrors<SecurityFormData>,
  isSubmitted: boolean,
  passwordLogic?: UsePasswordLogicReturn,
): SectionStatus {
  const password = formData.password || '';
  const confirmPassword = passwordLogic?.confirmPassword || '';

  const hasSecurityErrors = errors.password;
  const passwordsMatch = !password || !confirmPassword || password === confirmPassword;
  const allRequiredFilled = password.length > 0;
  const allOptionalFilled = confirmPassword.length > 0;

  // ПРИОРИТЕТЫ СТАТУСОВ:
  // 1. Есть ошибки zod → error (красный)
  if (hasSecurityErrors) return 'error';

  // 2. Пароли не совпадают → error (красный)
  if (!passwordsMatch) return 'error';

  // 3. Все поля заполнены и пароли совпадают → complete (зеленый)
  if (allRequiredFilled && allOptionalFilled && passwordsMatch) return 'complete';

  // 4. Обязательные заполнены, но подтверждение нет → warning (желтый)
  if (allRequiredFilled && !allOptionalFilled) return 'warning';

  // 5. Частично заполнены → pending (серый)
  if (password.length > 0 || confirmPassword.length > 0) return 'pending';

  return 'pending';
}

export function getSecurityErrors(
  formData: SecurityFormData,
  errors: FieldErrors<SecurityFormData>,
  isSubmitted: boolean,
  passwordLogic?: UsePasswordLogicReturn,
): string[] {
  const errorList: string[] = [];

  if (errors.password?.message) {
    errorList.push(errors.password.message);
  }

  const password = formData.password || '';
  const confirmPassword = passwordLogic?.confirmPassword || '';

  if (password && confirmPassword && password !== confirmPassword) {
    errorList.push('Пароли не совпадают');
  }

  return errorList;
}
