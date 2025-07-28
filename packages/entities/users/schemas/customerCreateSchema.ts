import { z } from 'zod';

/**
 * Схема валидации для создания клиента
 */
export const customerCreateSchema = z
  .object({
    email: z
      .string({
        message: 'Email должен быть строкой',
      })
      .min(1, { message: 'Email не может быть пустым' }),
    password: z
      .string({
        message: 'Пароль должен быть строкой',
      })
      .min(1, { message: 'Пароль не может быть пустым' }),
    confirmPassword: z
      .string({
        message: 'Подтверждение пароля должно быть строкой',
      })
      .min(1, { message: 'Подтверждение пароля не может быть пустым' }),
    phoneNumber: z
      .string({
        message: 'Номер телефона должен быть строкой',
      })
      .optional(),
    fullName: z
      .string({
        message: 'Полное имя должно быть строкой',
      })
      .min(1, { message: 'Полное имя не может быть пустым' }),
    avatarUrl: z
      .string({
        message: 'URL аватара должен быть строкой',
      })
      .nullable()
      .optional(),
    loyaltyPoints: z.number().int({ message: 'Баллы лояльности должны быть целым числом' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'], // Ошибка будет привязана к полю confirmPassword
  });

/**
 * Тип данных формы создания клиента
 */
export type CustomerCreateFormData = z.infer<typeof customerCreateSchema>;
