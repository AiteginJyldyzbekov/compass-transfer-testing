import { z } from 'zod';
import { OrderServiceDTOSchema } from './OrderServiceDTO.schema';
import { PassengerDTOSchema } from './PassengerDTO.schema';

/**
 * Схема валидации для создания мгновенного заказа (упрощенная)
 */
export const instantOrderCreateSchema = z
  .object({
    // Основные поля
    tariffId: z
      .string({ required_error: 'Выберите тариф' })
      .uuid({ message: 'Выберите корректный тариф' }),
    
    // Маршрут - либо готовый шаблон, либо ручной выбор
    routeType: z.enum(['template', 'manual'], {
      required_error: 'Выберите тип маршрута',
    }),
    
    routeId: z
      .string()
      .uuid({ message: 'Некорректный маршрут' })
      .optional()
      .or(z.literal('')),
    
    startLocationId: z
      .string()
      .uuid({ message: 'Некорректная начальная точка' })
      .optional()
      .or(z.literal('')),
    
    endLocationId: z
      .string()
      .uuid({ message: 'Некорректная конечная точка' })
      .optional()
      .or(z.literal('')),
    
    additionalStops: z
      .array(z.string().uuid({ message: 'Некорректная промежуточная точка' }))
      .default([]),
    
    // Услуги и цена
    services: z.array(OrderServiceDTOSchema).default([]),
    
    initialPrice: z
      .number({ required_error: 'Укажите стоимость' })
      .min(0, { message: 'Стоимость не может быть отрицательной' }),
    
    // Пассажиры
    passengers: z
      .array(PassengerDTOSchema)
      .min(1, { message: 'Добавьте хотя бы одного пассажира' }),
    
    // Платеж (опционально)
    paymentId: z
      .string()
      .min(1, { message: 'Некорректный ID платежа' })
      .optional()
      .or(z.literal('')),
  })
  .refine(
    data => {
      // Проверяем маршрут в зависимости от типа
      if (data.routeType === 'template') {
        return data.routeId && data.routeId.length > 0;
      }
      if (data.routeType === 'manual') {
        return data.startLocationId && data.startLocationId.length > 0 && 
               data.endLocationId && data.endLocationId.length > 0;
      }
      return false;
    },
    {
      message: 'Укажите либо готовый маршрут, либо начальную и конечную точки',
      path: ['routeId'],
    },
  )
  .refine(
    data => {
      // Проверяем, что есть хотя бы один главный пассажир
      const mainPassengers = data.passengers.filter(p => p.isMainPassenger);
      return mainPassengers.length === 1;
    },
    {
      message: 'Должен быть ровно один главный пассажир',
      path: ['passengers'],
    },
  );

/**
 * Схема валидации для создания запланированного заказа (упрощенная)
 */
export const scheduledOrderCreateSchema = instantOrderCreateSchema.extend({
  scheduledTime: z
    .string({ required_error: 'Выберите дату и время отправки' })
    .min(1, { message: 'Выберите дату и время отправки' }),
  
  // Дополнительные поля для запланированных заказов
  description: z
    .string()
    .max(511, { message: 'Описание не должно превышать 511 символов' })
    .optional()
    .or(z.literal('')),
  
  airFlight: z
    .string()
    .max(63, { message: 'Номер рейса прилета не должен превышать 63 символа' })
    .optional()
    .or(z.literal('')),
  
  flyReis: z
    .string()
    .max(20, { message: 'Номер рейса вылета не должен превышать 20 символов' })
    .regex(/^[A-Z0-9\s-]*$/, {
      message: 'Номер рейса вылета должен содержать только заглавные буквы, цифры, пробелы и дефисы',
    })
    .optional()
    .or(z.literal('')),
});

/**
 * Типы данных форм
 */
export type InstantOrderCreateFormData = z.infer<typeof instantOrderCreateSchema>;
export type ScheduledOrderCreateFormData = z.infer<typeof scheduledOrderCreateSchema>;

/**
 * Функция для подготовки данных мгновенного заказа перед отправкой на сервер
 */
export function prepareInstantOrderForAPI(data: InstantOrderCreateFormData) {
  const { routeType, ...apiData } = data;

  // Если выбран готовый маршрут, очищаем поля ручного выбора
  if (routeType === 'template') {
    return {
      ...apiData,
      routeId: data.routeId || undefined,
      startLocationId: undefined,
      endLocationId: undefined,
      paymentId: data.paymentId || undefined,
    };
  }
  
  // Если выбран ручной выбор, очищаем поле готового маршрута
  if (routeType === 'manual') {
    return {
      ...apiData,
      routeId: undefined,
      startLocationId: data.startLocationId || undefined,
      endLocationId: data.endLocationId || undefined,
      paymentId: data.paymentId || undefined,
    };
  }

  return apiData;
}

/**
 * Функция для подготовки данных запланированного заказа перед отправкой на сервер
 */
export function prepareScheduledOrderForAPI(data: ScheduledOrderCreateFormData) {
  const { routeType, ...apiData } = data;

  // Если выбран готовый маршрут, очищаем поля ручного выбора
  if (routeType === 'template') {
    return {
      ...apiData,
      routeId: data.routeId || undefined,
      startLocationId: undefined,
      endLocationId: undefined,
      description: data.description || undefined,
      airFlight: data.airFlight || undefined,
      flyReis: data.flyReis || undefined,
    };
  }
  
  // Если выбран ручной выбор, очищаем поле готового маршрута
  if (routeType === 'manual') {
    return {
      ...apiData,
      routeId: undefined,
      startLocationId: data.startLocationId || undefined,
      endLocationId: data.endLocationId || undefined,
      description: data.description || undefined,
      airFlight: data.airFlight || undefined,
      flyReis: data.flyReis || undefined,
    };
  }

  return apiData;
}
