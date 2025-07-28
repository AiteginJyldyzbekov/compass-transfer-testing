import { z } from 'zod';
import { NotificationType } from '../enums/NotificationType.enum';

// Типы заказов
const OrderType = z.enum(['Unknown', 'Instant', 'Scheduled', 'Partner', 'Shuttle', 'Subscription']);

/**
 * Схема валидации для создания уведомления
 */
export const notificationCreateSchema = z.object({
  type: z
    .nativeEnum(NotificationType, {
      required_error: 'Тип уведомления обязателен',
      invalid_type_error: 'Неверный тип уведомления',
    }),
  
  title: z
    .string()
    .min(1, { message: 'Заголовок уведомления обязателен' })
    .max(255, { message: 'Заголовок не должен превышать 255 символов' }),
  
  content: z
    .string()
    .max(1000, { message: 'Содержимое не должно превышать 1000 символов' })
    .optional()
    .or(z.literal('')),
  
  orderId: z
    .string()
    .uuid({ message: 'Некорректный формат UUID заказа' })
    .optional()
    .or(z.literal('')),
  
  rideId: z
    .string()
    .uuid({ message: 'Некорректный формат UUID поездки' })
    .optional()
    .or(z.literal('')),
  
  orderType: OrderType
    .optional(),
  
  userId: z
    .string()
    .uuid({ message: 'Некорректный формат UUID пользователя' })
    .optional()
    .or(z.literal('')),
});

/**
 * Тип данных формы создания уведомления
 */
export type NotificationCreateFormData = z.infer<typeof notificationCreateSchema>;
