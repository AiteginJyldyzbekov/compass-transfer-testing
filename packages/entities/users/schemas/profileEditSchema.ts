import { z } from 'zod';

/**
 * Схема валидации для формы редактирования профиля пользователя
 */
export const profileEditSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: 'Имя должно содержать не менее 3 символов' })
    .max(255, { message: 'Имя не должно превышать 255 символов' }),
  phoneNumber: z
    .string()
    .max(63, { message: 'Номер телефона не должен превышать 63 символа' })
    .optional(),
  email: z
    .string()
    .min(1, { message: 'Email обязателен' })
    .email({ message: 'Введите корректный email' })
    .max(255, { message: 'Email не должен превышать 255 символов' }),
});

/**
 * Тип данных формы редактирования профиля пользователя, выведенный из схемы
 */
export type ProfileEditFormData = z.infer<typeof profileEditSchema>;
