import type { FieldErrors } from 'react-hook-form';
import type { TariffCreateFormData } from '../../schemas/tariffCreateSchema';
import type { TariffUpdateFormData } from '../../schemas/tariffUpdateSchema';

/**
 * Получает статус главы "Основная информация" для создания тарифа
 */
export function getBasicTariffDataStatus(
  formData: TariffCreateFormData,
  errors: FieldErrors<TariffCreateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок
  const hasErrors = errors.name || errors.serviceClass || errors.carType;
  
  if (hasErrors) {
    return 'error';
  }

  // Проверяем заполненность обязательных полей
  const requiredFieldsFilled = 
    formData.name && 
    formData.name.length > 0 && 
    formData.serviceClass &&
    formData.carType;

  if (requiredFieldsFilled) {
    return 'complete';
  }

  return 'pending';
}

/**
 * Получает статус главы "Ценообразование" для создания тарифа
 */
export function getPricingTariffDataStatus(
  formData: TariffCreateFormData,
  errors: FieldErrors<TariffCreateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок
  const hasErrors = errors.basePrice || errors.minutePrice || errors.minimumPrice || 
                   errors.perKmPrice || errors.freeWaitingTimeMinutes;
  
  if (hasErrors) {
    return 'error';
  }

  // Проверяем заполненность обязательных полей
  const requiredFieldsFilled = 
    formData.basePrice !== undefined && 
    formData.minutePrice !== undefined &&
    formData.minimumPrice !== undefined &&
    formData.perKmPrice !== undefined &&
    formData.freeWaitingTimeMinutes !== undefined;

  if (requiredFieldsFilled) {
    return 'complete';
  }

  return 'pending';
}

/**
 * Получает статус главы "Основная информация" для редактирования тарифа
 */
export function getBasicTariffDataStatusForUpdate(
  formData: TariffUpdateFormData,
  errors: FieldErrors<TariffUpdateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок
  const hasErrors = errors.name || errors.serviceClass || errors.carType;
  
  if (hasErrors) {
    return 'error';
  }

  // Проверяем заполненность обязательных полей
  const requiredFieldsFilled = 
    formData.name && 
    formData.name.length > 0 && 
    formData.serviceClass &&
    formData.carType;

  if (requiredFieldsFilled) {
    return 'complete';
  }

  return 'pending';
}

/**
 * Получает статус главы "Ценообразование" для редактирования тарифа
 */
export function getPricingTariffDataStatusForUpdate(
  formData: TariffUpdateFormData,
  errors: FieldErrors<TariffUpdateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок
  const hasErrors = errors.basePrice || errors.minutePrice || errors.minimumPrice || 
                   errors.perKmPrice || errors.freeWaitingTimeMinutes;
  
  if (hasErrors) {
    return 'error';
  }

  // Проверяем заполненность обязательных полей
  const requiredFieldsFilled = 
    formData.basePrice !== undefined && 
    formData.minutePrice !== undefined &&
    formData.minimumPrice !== undefined &&
    formData.perKmPrice !== undefined &&
    formData.freeWaitingTimeMinutes !== undefined;

  if (requiredFieldsFilled) {
    return 'complete';
  }

  return 'pending';
}

/**
 * Получает список ошибок для главы "Основная информация" при создании тарифа
 */
export function getBasicTariffDataErrors(
  formData: TariffCreateFormData,
  errors: FieldErrors<TariffCreateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.name?.message) errorList.push(errors.name.message);
  if (errors.serviceClass?.message) errorList.push(errors.serviceClass.message);
  if (errors.carType?.message) errorList.push(errors.carType.message);

  return errorList;
}

/**
 * Получает список ошибок для главы "Ценообразование" при создании тарифа
 */
export function getPricingTariffDataErrors(
  formData: TariffCreateFormData,
  errors: FieldErrors<TariffCreateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.basePrice?.message) errorList.push(errors.basePrice.message);
  if (errors.minutePrice?.message) errorList.push(errors.minutePrice.message);
  if (errors.minimumPrice?.message) errorList.push(errors.minimumPrice.message);
  if (errors.perKmPrice?.message) errorList.push(errors.perKmPrice.message);
  if (errors.freeWaitingTimeMinutes?.message) errorList.push(errors.freeWaitingTimeMinutes.message);

  return errorList;
}

/**
 * Получает список ошибок для главы "Основная информация" при редактировании тарифа
 */
export function getBasicTariffDataErrorsForUpdate(
  formData: TariffUpdateFormData,
  errors: FieldErrors<TariffUpdateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.name?.message) errorList.push(errors.name.message);
  if (errors.serviceClass?.message) errorList.push(errors.serviceClass.message);
  if (errors.carType?.message) errorList.push(errors.carType.message);

  return errorList;
}

/**
 * Получает список ошибок для главы "Ценообразование" при редактировании тарифа
 */
export function getPricingTariffDataErrorsForUpdate(
  formData: TariffUpdateFormData,
  errors: FieldErrors<TariffUpdateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.basePrice?.message) errorList.push(errors.basePrice.message);
  if (errors.minutePrice?.message) errorList.push(errors.minutePrice.message);
  if (errors.minimumPrice?.message) errorList.push(errors.minimumPrice.message);
  if (errors.perKmPrice?.message) errorList.push(errors.perKmPrice.message);
  if (errors.freeWaitingTimeMinutes?.message) errorList.push(errors.freeWaitingTimeMinutes.message);

  return errorList;
}
