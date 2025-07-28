import { z } from 'zod';
import { ActivityStatus } from '@entities/users/enums';

/**
 * Схема валидации для создания терминала
 */
export const terminalCreateSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'Email обязателен' })
      .email({ message: 'Введите корректный email' })
      .max(255, { message: 'Email не должен превышать 255 символов' }),
    password: z.string().min(8, { message: 'Пароль должен содержать не менее 8 символов' }),
    confirmPassword: z.string().min(1, { message: 'Подтверждение пароля обязательно' }),
    phoneNumber: z
      .string()
      .max(63, { message: 'Номер телефона не должен превышать 63 символа' })
      .nullable()
      .optional(),
    fullName: z
      .string()
      .min(1, { message: 'Полное имя обязательно' })
      .max(255, { message: 'Полное имя не должно превышать 255 символов' }),
    avatarUrl: z.string().nullable().optional(),
    status: z.nativeEnum(ActivityStatus, {
      message: 'Выберите статус терминала',
    }),
    locationId: z.string().uuid({ message: 'Некорректный UUID локации' }).nullable().optional(),
    profile: z.object({
      terminalId: z
        .string()
        .min(1, { message: 'Идентификатор терминала обязателен' })
        .max(31, { message: 'Идентификатор терминала не должен превышать 31 символ' }),
      ipAddress: z
        .string()
        .max(45, { message: 'IP адрес не должен превышать 45 символов' })
        .nullable(),
      deviceModel: z
        .string()
        .max(127, { message: 'Модель устройства не должна превышать 127 символов' })
        .nullable(),
      osVersion: z
        .string()
        .max(31, { message: 'Версия ОС не должна превышать 31 символ' })
        .nullable(),
      appVersion: z
        .string()
        .max(31, { message: 'Версия приложения не должна превышать 31 символ' })
        .nullable(),
      browserInfo: z
        .string()
        .max(127, { message: 'Информация о браузере не должна превышать 127 символов' })
        .nullable(),
      screenResolution: z
        .string()
        .max(15, { message: 'Разрешение экрана не должно превышать 15 символов' })
        .nullable(),
      deviceIdentifier: z
        .string()
        .max(31, { message: 'Идентификатор устройства не должен превышать 31 символ' })
        .nullable(),
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'], // Ошибка будет привязана к полю confirmPassword
  });

/**
 * Тип данных формы создания терминала
 */
export type TerminalCreateFormData = z.infer<typeof terminalCreateSchema>;
