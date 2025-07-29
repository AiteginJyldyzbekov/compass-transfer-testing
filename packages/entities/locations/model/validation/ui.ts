import type { FieldErrors } from 'react-hook-form';
import type { LocationCreateFormData } from '../../schemas/locationCreateSchema';
import type { LocationUpdateFormData } from '../../schemas/locationUpdateSchema';

/**
 * Получает статус главы "Основная информация" для создания локации
 */
export function getBasicLocationDataStatus(
  formData: LocationCreateFormData,
  errors: FieldErrors<LocationCreateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок
  const hasErrors = errors.name || errors.description || errors.type || errors.address;
  
  if (hasErrors) {
    return 'error';
  }

  // Проверяем заполненность обязательных полей
  const requiredFieldsFilled = 
    formData.name && 
    formData.name.length > 0 && 
    formData.type &&
    formData.address &&
    formData.address.length > 0;

  if (requiredFieldsFilled) {
    // Если описание не заполнено, показываем предупреждение
    if (!formData.description || formData.description.trim() === '') {
      return 'warning';
    }
    return 'complete';
  }

  return 'pending';
}

/**
 * Получает статус главы "Местоположение на карте" для создания локации
 */
export function getMapLocationDataStatus(
  formData: LocationCreateFormData,
  errors: FieldErrors<LocationCreateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок координат
  const hasErrors = errors.latitude || errors.longitude;

  if (hasErrors) {
    return 'error';
  }

  // Проверяем заполненность координат
  const coordinatesFilled =
    formData.latitude !== undefined &&
    formData.longitude !== undefined;

  if (coordinatesFilled) {
    return 'complete';
  }

  return 'pending';
}

/**
 * Получает статус главы "Настройки локации" для создания локации
 */
export function getCoordinatesLocationDataStatus(
  formData: LocationCreateFormData,
  errors: FieldErrors<LocationCreateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок настроек
  const hasErrors = errors.isActive || errors.popular;

  if (hasErrors) {
    return 'error';
  }

  // Проверяем заполненность обязательных полей настроек
  const settingsFilled =
    formData.isActive !== undefined &&
    formData.popular !== undefined;

  if (settingsFilled) {
    return 'complete';
  }

  return 'pending';
}

/**
 * Получает статус главы "Основная информация" для редактирования локации
 */
export function getBasicLocationDataStatusForUpdate(
  formData: LocationUpdateFormData,
  errors: FieldErrors<LocationUpdateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок
  const hasErrors = errors.name || errors.description || errors.type || errors.address;
  
  if (hasErrors) {
    return 'error';
  }

  // Проверяем заполненность обязательных полей
  const requiredFieldsFilled = 
    formData.name && 
    formData.name.length > 0 && 
    formData.type &&
    formData.address &&
    formData.address.length > 0;

  if (requiredFieldsFilled) {
    // Если описание не заполнено, показываем предупреждение
    if (!formData.description || formData.description.trim() === '') {
      return 'warning';
    }
    return 'complete';
  }

  return 'pending';
}

/**
 * Получает статус главы "Координаты и настройки" для редактирования локации
 */
export function getCoordinatesLocationDataStatusForUpdate(
  formData: LocationUpdateFormData,
  errors: FieldErrors<LocationUpdateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок
  const hasErrors = errors.latitude || errors.longitude || errors.isActive || errors.popular || errors.popular2;
  
  if (hasErrors) {
    return 'error';
  }

  // Проверяем заполненность обязательных полей
  const requiredFieldsFilled = 
    formData.latitude !== undefined && 
    formData.longitude !== undefined &&
    formData.isActive !== undefined &&
    formData.popular !== undefined &&
    formData.popular2 !== undefined;

  if (requiredFieldsFilled) {
    return 'complete';
  }

  return 'pending';
}

/**
 * Получает список ошибок для главы "Основная информация" при создании локации
 */
export function getBasicLocationDataErrors(
  formData: LocationCreateFormData,
  errors: FieldErrors<LocationCreateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.name?.message) errorList.push(errors.name.message);
  if (errors.description?.message) errorList.push(errors.description.message);
  if (errors.type?.message) errorList.push(errors.type.message);
  if (errors.address?.message) errorList.push(errors.address.message);

  return errorList;
}

/**
 * Получает список ошибок для главы "Местоположение на карте" при создании локации
 */
export function getMapLocationDataErrors(
  formData: LocationCreateFormData,
  errors: FieldErrors<LocationCreateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.latitude?.message) errorList.push(errors.latitude.message);
  if (errors.longitude?.message) errorList.push(errors.longitude.message);

  return errorList;
}

/**
 * Получает список ошибок для главы "Настройки локации" при создании локации
 */
export function getCoordinatesLocationDataErrors(
  formData: LocationCreateFormData,
  errors: FieldErrors<LocationCreateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.isActive?.message) errorList.push(errors.isActive.message);
  if (errors.popular?.message) errorList.push(errors.popular.message);

  return errorList;
}

/**
 * Получает список ошибок для главы "Основная информация" при редактировании локации
 */
export function getBasicLocationDataErrorsForUpdate(
  formData: LocationUpdateFormData,
  errors: FieldErrors<LocationUpdateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.name?.message) errorList.push(errors.name.message);
  if (errors.description?.message) errorList.push(errors.description.message);
  if (errors.type?.message) errorList.push(errors.type.message);
  if (errors.address?.message) errorList.push(errors.address.message);

  return errorList;
}

/**
 * Получает список ошибок для главы "Координаты и настройки" при редактировании локации
 */
export function getCoordinatesLocationDataErrorsForUpdate(
  formData: LocationUpdateFormData,
  errors: FieldErrors<LocationUpdateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.latitude?.message) errorList.push(errors.latitude.message);
  if (errors.longitude?.message) errorList.push(errors.longitude.message);
  if (errors.isActive?.message) errorList.push(errors.isActive.message);
  if (errors.popular?.message) errorList.push(errors.popular.message);

  return errorList;
}
