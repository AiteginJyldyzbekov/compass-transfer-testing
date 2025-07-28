import type { FieldErrors } from 'react-hook-form';

// Тип для статуса секции
type SectionStatus = 'complete' | 'warning' | 'error' | 'pending';

export interface TerminalDataFields {
  status: string;
  locationId: string;
  profile: {
    terminalId: string;
    ipAddress?: string | null;
    deviceModel?: string | null;
    osVersion?: string | null;
    appVersion?: string | null;
    browserInfo?: string | null;
    screenResolution?: string | null;
    deviceIdentifier?: string | null;
  };
}

export function getTerminalDataStatus(
  profile: TerminalDataFields['profile'],
  errors: FieldErrors<{ profile: TerminalDataFields['profile'] }>,
  _isSubmitted: boolean,
): SectionStatus {
  const required = [profile.terminalId];
  const allRequiredFilled = required.every(v => v && String(v).length > 0);
  const hasErrors = errors.profile?.terminalId;

  if (hasErrors) return 'error';
  if (allRequiredFilled) return 'complete';
  if (required.some(v => v && String(v).length > 0)) return 'pending';

  return 'pending';
}

export function getTerminalDataErrors(
  profile: TerminalDataFields['profile'],
  errors: FieldErrors<{ profile: TerminalDataFields['profile'] }>,
  _isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.profile?.terminalId?.message)
    errorList.push('Ошибка - ID терминала: ' + errors.profile.terminalId.message);

  // Можно добавить другие поля по аналогии
  return errorList;
}
