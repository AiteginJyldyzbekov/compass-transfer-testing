import type { FieldErrors } from 'react-hook-form';
import type { ServiceCreateFormData } from '@entities/services/schemas/serviceCreateSchema';
import type { ServiceUpdateFormData } from '@entities/services/schemas/serviceUpdateSchema';

/**
 * Получает статус главы "Основная информация" для создания услуги
 */
export function getBasicServiceDataStatus(
  formData: ServiceCreateFormData,
  errors: FieldErrors<ServiceCreateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок
  const hasErrors = errors.name || errors.description || errors.price || errors.isQuantifiable;
  
  if (hasErrors) {
    return 'error';
  }

  // Проверяем заполненность обязательных полей
  const requiredFieldsFilled = 
    formData.name && 
    formData.name.length > 0 && 
    formData.price !== undefined && 
    formData.price > 0 &&
    formData.isQuantifiable !== undefined;

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
 * Получает статус главы "Основная информация" для редактирования услуги
 */
export function getBasicServiceDataStatusForUpdate(
  formData: ServiceUpdateFormData,
  errors: FieldErrors<ServiceUpdateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок
  const hasErrors = errors.name || errors.description || errors.price || errors.isQuantifiable;
  
  if (hasErrors) {
    return 'error';
  }

  // Проверяем заполненность обязательных полей
  const requiredFieldsFilled = 
    formData.name && 
    formData.name.length > 0 && 
    formData.price !== undefined && 
    formData.price > 0 &&
    formData.isQuantifiable !== undefined;

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
 * Получает список ошибок для главы "Основная информация" при создании услуги
 */
export function getBasicServiceDataErrors(
  formData: ServiceCreateFormData,
  errors: FieldErrors<ServiceCreateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.name?.message) errorList.push(errors.name.message);
  if (errors.description?.message) errorList.push(errors.description.message);
  if (errors.price?.message) errorList.push(errors.price.message);
  if (errors.isQuantifiable?.message) errorList.push(errors.isQuantifiable.message);

  return errorList;
}

/**
 * Получает список ошибок для главы "Основная информация" при редактировании услуги
 */
export function getBasicServiceDataErrorsForUpdate(
  formData: ServiceUpdateFormData,
  errors: FieldErrors<ServiceUpdateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.name?.message) errorList.push(errors.name.message);
  if (errors.description?.message) errorList.push(errors.description.message);
  if (errors.price?.message) errorList.push(errors.price.message);
  if (errors.isQuantifiable?.message) errorList.push(errors.isQuantifiable.message);

  return errorList;
}
