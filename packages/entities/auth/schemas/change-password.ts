import { z } from 'zod';

/**
 * Схема валидации для смены пароля
 */
export const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, { message: 'Введите текущий пароль' }),
    newPassword: z
      .string()
      .min(8, { message: 'Новый пароль должен содержать минимум 8 символов' })
      .max(100, { message: 'Новый пароль не должен превышать 100 символов' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Подтвердите новый пароль' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

/**
 * Тип данных формы смены пароля
 */
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
