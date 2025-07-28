import type { FieldErrors } from 'react-hook-form';
import type { CarCreateFormData } from '../../schemas/carCreateSchema';
import type { CarUpdateFormData } from '../../schemas/carUpdateSchema';

/**
 * Получает статус главы "Основная информация" для создания автомобиля
 */
export function getBasicCarDataStatus(
  formData: CarCreateFormData,
  errors: FieldErrors<CarCreateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок
  const hasErrors = errors.make || errors.model || errors.year || errors.color || 
                   errors.licensePlate || errors.type || errors.serviceClass || 
                   errors.status || errors.passengerCapacity;
  
  if (hasErrors) {
    return 'error';
  }

  // Проверяем заполненность обязательных полей
  const requiredFieldsFilled = 
    formData.make && 
    formData.make.length > 0 && 
    formData.model &&
    formData.model.length > 0 &&
    formData.year !== undefined &&
    formData.color &&
    formData.licensePlate &&
    formData.licensePlate.length > 0 &&
    formData.type &&
    formData.serviceClass &&
    formData.status &&
    formData.passengerCapacity !== undefined;

  if (requiredFieldsFilled) {
    return 'complete';
  }

  return 'pending';
}

/**
 * Получает статус главы "Дополнительные опции" для создания автомобиля
 */
export function getFeaturesCarDataStatus(
  formData: CarCreateFormData,
  errors: FieldErrors<CarCreateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок
  const hasErrors = errors.features;
  
  if (hasErrors) {
    return 'error';
  }

  // Проверяем заполненность обязательных полей
  const requiredFieldsFilled = formData.features && formData.features.length > 0;

  if (requiredFieldsFilled) {
    return 'complete';
  }

  return 'pending';
}

/**
 * Получает статус главы "Основная информация" для редактирования автомобиля
 */
export function getBasicCarDataStatusForUpdate(
  formData: CarUpdateFormData,
  errors: FieldErrors<CarUpdateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок
  const hasErrors = errors.make || errors.model || errors.year || errors.color || 
                   errors.licensePlate || errors.type || errors.serviceClass || 
                   errors.status || errors.passengerCapacity;
  
  if (hasErrors) {
    return 'error';
  }

  // Проверяем заполненность обязательных полей
  const requiredFieldsFilled = 
    formData.make && 
    formData.make.length > 0 && 
    formData.model &&
    formData.model.length > 0 &&
    formData.year !== undefined &&
    formData.color &&
    formData.licensePlate &&
    formData.licensePlate.length > 0 &&
    formData.type &&
    formData.serviceClass &&
    formData.status &&
    formData.passengerCapacity !== undefined;

  if (requiredFieldsFilled) {
    return 'complete';
  }

  return 'pending';
}

/**
 * Получает статус главы "Дополнительные опции" для редактирования автомобиля
 */
export function getFeaturesCarDataStatusForUpdate(
  formData: CarUpdateFormData,
  errors: FieldErrors<CarUpdateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок
  const hasErrors = errors.features;
  
  if (hasErrors) {
    return 'error';
  }

  // Проверяем заполненность обязательных полей
  const requiredFieldsFilled = formData.features && formData.features.length > 0;

  if (requiredFieldsFilled) {
    return 'complete';
  }

  return 'pending';
}

/**
 * Получает список ошибок для главы "Основная информация" при создании автомобиля
 */
export function getBasicCarDataErrors(
  formData: CarCreateFormData,
  errors: FieldErrors<CarCreateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.make?.message) errorList.push(errors.make.message);
  if (errors.model?.message) errorList.push(errors.model.message);
  if (errors.year?.message) errorList.push(errors.year.message);
  if (errors.color?.message) errorList.push(errors.color.message);
  if (errors.licensePlate?.message) errorList.push(errors.licensePlate.message);
  if (errors.type?.message) errorList.push(errors.type.message);
  if (errors.serviceClass?.message) errorList.push(errors.serviceClass.message);
  if (errors.status?.message) errorList.push(errors.status.message);
  if (errors.passengerCapacity?.message) errorList.push(errors.passengerCapacity.message);

  return errorList;
}

/**
 * Получает список ошибок для главы "Дополнительные опции" при создании автомобиля
 */
export function getFeaturesCarDataErrors(
  formData: CarCreateFormData,
  errors: FieldErrors<CarCreateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.features?.message) errorList.push(errors.features.message);

  return errorList;
}

/**
 * Получает список ошибок для главы "Основная информация" при редактировании автомобиля
 */
export function getBasicCarDataErrorsForUpdate(
  formData: CarUpdateFormData,
  errors: FieldErrors<CarUpdateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.make?.message) errorList.push(errors.make.message);
  if (errors.model?.message) errorList.push(errors.model.message);
  if (errors.year?.message) errorList.push(errors.year.message);
  if (errors.color?.message) errorList.push(errors.color.message);
  if (errors.licensePlate?.message) errorList.push(errors.licensePlate.message);
  if (errors.type?.message) errorList.push(errors.type.message);
  if (errors.serviceClass?.message) errorList.push(errors.serviceClass.message);
  if (errors.status?.message) errorList.push(errors.status.message);
  if (errors.passengerCapacity?.message) errorList.push(errors.passengerCapacity.message);

  return errorList;
}

/**
 * Получает список ошибок для главы "Дополнительные опции" при редактировании автомобиля
 */
export function getFeaturesCarDataErrorsForUpdate(
  formData: CarUpdateFormData,
  errors: FieldErrors<CarUpdateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.features?.message) errorList.push(errors.features.message);

  return errorList;
}
