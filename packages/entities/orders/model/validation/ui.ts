import type { FieldErrors } from 'react-hook-form';
import type { InstantOrderCreateFormData, ScheduledOrderCreateFormData } from '../../schemas/orderCreateSchema';

/**
 * Получает статус главы "Основная информация" для создания мгновенного заказа
 */
export function getBasicOrderDataStatus(
  formData: InstantOrderCreateFormData,
  errors: FieldErrors<InstantOrderCreateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок
  const hasErrors = errors.tariffId || errors.routeType || errors.routeId || 
                   errors.startLocationId || errors.endLocationId || errors.initialPrice;
  
  if (hasErrors) {
    return 'error';
  }

  // Проверяем заполненность обязательных полей
  const requiredFieldsFilled = 
    formData.tariffId && 
    formData.tariffId.length > 0 && 
    formData.routeType &&
    formData.initialPrice !== undefined;

  // Проверяем маршрут в зависимости от типа
  let routeValid = false;
  if (formData.routeType === 'template') {
    routeValid = formData.routeId && formData.routeId.length > 0;
  } else if (formData.routeType === 'manual') {
    routeValid = formData.startLocationId && formData.startLocationId.length > 0 &&
                 formData.endLocationId && formData.endLocationId.length > 0;
  }

  if (requiredFieldsFilled && routeValid) {
    return 'complete';
  }

  return 'pending';
}

/**
 * Получает статус главы "Пассажиры" для создания заказа
 */
export function getPassengersOrderDataStatus(
  formData: InstantOrderCreateFormData,
  errors: FieldErrors<InstantOrderCreateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок
  const hasErrors = errors.passengers;
  
  if (hasErrors) {
    return 'error';
  }

  // Проверяем заполненность пассажиров
  const hasPassengers = formData.passengers && formData.passengers.length > 0;
  
  if (!hasPassengers) {
    return 'pending';
  }

  // Проверяем, что все пассажиры заполнены корректно
  const allPassengersValid = formData.passengers.every(passenger => 
    passenger.firstName && passenger.firstName.length > 0
  );

  // Проверяем, что есть ровно один главный пассажир
  const mainPassengers = formData.passengers.filter(p => p.isMainPassenger);
  const hasOneMainPassenger = mainPassengers.length === 1;

  if (allPassengersValid && hasOneMainPassenger) {
    return 'complete';
  }

  if (allPassengersValid && !hasOneMainPassenger) {
    return 'warning';
  }

  return 'pending';
}

/**
 * Получает статус главы "Расписание" для создания запланированного заказа
 */
export function getScheduleOrderDataStatus(
  formData: ScheduledOrderCreateFormData,
  errors: FieldErrors<ScheduledOrderCreateFormData>,
  isSubmitted: boolean,
): 'complete' | 'warning' | 'error' | 'pending' {
  // Проверяем наличие ошибок
  const hasErrors = errors.scheduledTime || errors.description || errors.airFlight || errors.flyReis;
  
  if (hasErrors) {
    return 'error';
  }

  // Проверяем заполненность обязательных полей
  const requiredFieldsFilled = formData.scheduledTime && formData.scheduledTime.length > 0;

  if (requiredFieldsFilled) {
    return 'complete';
  }

  return 'pending';
}

/**
 * Получает список ошибок для главы "Основная информация" при создании заказа
 */
export function getBasicOrderDataErrors(
  formData: InstantOrderCreateFormData,
  errors: FieldErrors<InstantOrderCreateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.tariffId?.message) errorList.push(errors.tariffId.message);
  if (errors.routeType?.message) errorList.push(errors.routeType.message);
  if (errors.routeId?.message) errorList.push(errors.routeId.message);
  if (errors.startLocationId?.message) errorList.push(errors.startLocationId.message);
  if (errors.endLocationId?.message) errorList.push(errors.endLocationId.message);
  if (errors.initialPrice?.message) errorList.push(errors.initialPrice.message);

  return errorList;
}

/**
 * Получает список ошибок для главы "Пассажиры" при создании заказа
 */
export function getPassengersOrderDataErrors(
  formData: InstantOrderCreateFormData,
  errors: FieldErrors<InstantOrderCreateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.passengers?.message) errorList.push(errors.passengers.message);

  // Добавляем ошибки отдельных пассажиров
  if (errors.passengers && Array.isArray(errors.passengers)) {
    errors.passengers.forEach((passengerError, index) => {
      if (passengerError?.firstName?.message) {
        errorList.push(`Пассажир ${index + 1}: ${passengerError.firstName.message}`);
      }
      if (passengerError?.lastName?.message) {
        errorList.push(`Пассажир ${index + 1}: ${passengerError.lastName.message}`);
      }
      if (passengerError?.isMainPassenger?.message) {
        errorList.push(`Пассажир ${index + 1}: ${passengerError.isMainPassenger.message}`);
      }
    });
  }

  return errorList;
}

/**
 * Получает список ошибок для главы "Расписание" при создании запланированного заказа
 */
export function getScheduleOrderDataErrors(
  formData: ScheduledOrderCreateFormData,
  errors: FieldErrors<ScheduledOrderCreateFormData>,
  isSubmitted: boolean,
): string[] {
  const errorList: string[] = [];

  if (errors.scheduledTime?.message) errorList.push(errors.scheduledTime.message);
  if (errors.description?.message) errorList.push(errors.description.message);
  if (errors.airFlight?.message) errorList.push(errors.airFlight.message);
  if (errors.flyReis?.message) errorList.push(errors.flyReis.message);

  return errorList;
}
