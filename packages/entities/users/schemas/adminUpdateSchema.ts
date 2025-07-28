import { z } from 'zod';

/**
 * Схема валидации для обновления администратора
 */
export const adminUpdateSchema = z.object({
  phoneNumber: z
    .string()
    .max(63, { message: 'Номер телефона не должен превышать 63 символа' })
    .optional(),
  fullName: z
    .string()
    .min(1, { message: 'Полное имя обязательно' })
    .max(255, { message: 'Полное имя не должно превышать 255 символов' }),
  avatarUrl: z.string().nullable().optional(),
  profile: z.object({
    accessLevel: z.string().max(63, { message: 'Уровень доступа не должен превышать 63 символа' }),
    department: z
      .string()
      .max(127, { message: 'Отдел не должен превышать 127 символов' })
      .nullable(),
    position: z
      .string()
      .max(127, { message: 'Должность не должна превышать 127 символов' })
      .nullable(),
  }),
});

/**
 * Тип данных формы обновления администратора
 */
export type AdminUpdateFormData = z.infer<typeof adminUpdateSchema>;
