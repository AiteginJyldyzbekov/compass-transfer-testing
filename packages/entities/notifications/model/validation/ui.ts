import type { FieldErrors } from 'react-hook-form';
import type { NotificationCreateFormData } from '../../schemas/notificationCreateSchema';
import type { NotificationUpdateFormData } from '../../schemas/notificationUpdateSchema';

/**
 * Получает статус главы "Основная информация" для создания уведомления
 */
export function getBasicNotificationDataStatus(
  formData: NotificationCreateFormData,
  errors: FieldErrors<NotificationCreateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок
  const hasErrors = errors.type || errors.title || errors.content || errors.orderType;
  
  if (hasErrors) {
    return 'error';
  }

  // Проверяем заполненность обязательных полей
  const requiredFieldsFilled = 
    formData.type && 
    formData.title && 
    formData.title.length > 0;

  if (requiredFieldsFilled) {
    // Если содержимое не заполнено, показываем предупреждение
    if (!formData.content || formData.content.trim() === '') {
      return 'warning';
    }
    return 'complete';
  }

  return 'pending';
}

/**
 * Получает статус главы "Связанные данные" для создания уведомления
 */
export function getRelationsNotificationDataStatus(
  formData: NotificationCreateFormData,
  errors: FieldErrors<NotificationCreateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок
  const hasErrors = errors.orderId || errors.rideId || errors.userId;
  
  if (hasErrors) {
    return 'error';
  }

  // Все поля в этой секции необязательны, поэтому если нет ошибок - всё в порядке
  return 'complete';
}

/**
 * Получает статус главы "Основная информация" для редактирования уведомления
 */
export function getBasicNotificationDataStatusForUpdate(
  formData: NotificationUpdateFormData,
  errors: FieldErrors<NotificationUpdateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок
  const hasErrors = errors.type || errors.title || errors.content || errors.orderType;
  
  if (hasErrors) {
    return 'error';
  }

  // Для редактирования поля могут быть необязательными
  if (formData.title && formData.title.length > 0) {
    // Если содержимое не заполнено, показываем предупреждение
    if (!formData.content || formData.content.trim() === '') {
      return 'warning';
    }
    return 'complete';
  }

  return 'pending';
}

/**
 * Получает статус главы "Связанные данные" для редактирования уведомления
 */
export function getRelationsNotificationDataStatusForUpdate(
  formData: NotificationUpdateFormData,
  errors: FieldErrors<NotificationUpdateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок
  const hasErrors = errors.orderId || errors.rideId || errors.isRead;
  
  if (hasErrors) {
    return 'error';
  }

  // Все поля в этой секции необязательны, поэтому если нет ошибок - всё в порядке
  return 'complete';
}

/**
 * Получает список ошибок для главы "Основная информация" при создании уведомления
 */
export function getBasicNotificationDataErrors(
  formData: NotificationCreateFormData,
  errors: FieldErrors<NotificationCreateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.type?.message) errorList.push(errors.type.message);
  if (errors.title?.message) errorList.push(errors.title.message);
  if (errors.content?.message) errorList.push(errors.content.message);
  if (errors.orderType?.message) errorList.push(errors.orderType.message);

  return errorList;
}

/**
 * Получает список ошибок для главы "Связанные данные" при создании уведомления
 */
export function getRelationsNotificationDataErrors(
  formData: NotificationCreateFormData,
  errors: FieldErrors<NotificationCreateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.orderId?.message) errorList.push(errors.orderId.message);
  if (errors.rideId?.message) errorList.push(errors.rideId.message);
  if (errors.userId?.message) errorList.push(errors.userId.message);

  return errorList;
}

/**
 * Получает список ошибок для главы "Основная информация" при редактировании уведомления
 */
export function getBasicNotificationDataErrorsForUpdate(
  formData: NotificationUpdateFormData,
  errors: FieldErrors<NotificationUpdateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.type?.message) errorList.push(errors.type.message);
  if (errors.title?.message) errorList.push(errors.title.message);
  if (errors.content?.message) errorList.push(errors.content.message);
  if (errors.orderType?.message) errorList.push(errors.orderType.message);

  return errorList;
}

/**
 * Получает список ошибок для главы "Связанные данные" при редактировании уведомления
 */
export function getRelationsNotificationDataErrorsForUpdate(
  formData: NotificationUpdateFormData,
  errors: FieldErrors<NotificationUpdateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.orderId?.message) errorList.push(errors.orderId.message);
  if (errors.rideId?.message) errorList.push(errors.rideId.message);
  if (errors.isRead?.message) errorList.push(errors.isRead.message);

  return errorList;
}
