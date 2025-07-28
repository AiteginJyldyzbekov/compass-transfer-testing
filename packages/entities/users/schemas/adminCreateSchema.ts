import { z } from 'zod';

/**
 * Схема валидации для создания администратора
 */
export const adminCreateSchema = z
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
      .optional(),
    fullName: z
      .string()
      .min(1, { message: 'Полное имя обязательно' })
      .max(255, { message: 'Полное имя не должно превышать 255 символов' }),
    // avatarUrl: z
    //   .string()
    //   .optional(),
    profile: z.object({
      accessLevel: z
        .string()
        .min(1, { message: 'Уровень доступа обязателен' })
        .max(63, { message: 'Уровень доступа не должен превышать 63 символа' }),
      department: z
        .string()
        .max(127, { message: 'Отдел не должен превышать 127 символов' })
        .nullable(),
      position: z
        .string()
        .max(127, { message: 'Должность не должна превышать 127 символов' })
        .nullable(),
      employeeId: z.string().max(63, { message: 'Табельный номер не должен превышать 63 символа' }),
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'], // Ошибка будет привязана к полю confirmPassword
  });

/**
 * Тип данных формы создания администратора
 */
export type AdminCreateFormData = z.infer<typeof adminCreateSchema>;
