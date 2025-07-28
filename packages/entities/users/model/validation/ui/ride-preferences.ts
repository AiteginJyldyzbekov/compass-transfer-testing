import type { FieldErrors } from 'react-hook-form';

// Тип для статуса секции
type SectionStatus = 'complete' | 'warning' | 'error' | 'pending';

export interface RidePreferencesFields {
  profile: {
    preferredRideTypes: string[];
  };
}

export function getRidePreferencesStatus(
  profile: RidePreferencesFields['profile'],
  errors: FieldErrors<{ profile: RidePreferencesFields['profile'] }>,
  _isSubmitted: boolean,
): SectionStatus {
  const hasErrors = errors.profile?.preferredRideTypes;
  const hasData = Array.isArray(profile.preferredRideTypes) && profile.preferredRideTypes.length > 0;

  if (hasErrors) return 'error';
  if (hasData) return 'complete';
  
  // Это необязательная секция, показываем warning если ничего не выбрано
  return 'warning';
}

export function getRidePreferencesErrors(
  profile: RidePreferencesFields['profile'],
  errors: FieldErrors<{ profile: RidePreferencesFields['profile'] }>,
  _isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.profile?.preferredRideTypes?.message)
    errorList.push(errors.profile.preferredRideTypes.message);

  return errorList;
}
