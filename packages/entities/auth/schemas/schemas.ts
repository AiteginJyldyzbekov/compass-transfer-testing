import { z } from 'zod';

// Схема валидации для формы входа
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email обязателен' })
    .email({ message: 'Некорректный формат email' }),
  password: z
    .string()
    .min(6, { message: 'Пароль должен содержать минимум 6 символов' })
    .max(100, { message: 'Пароль не должен превышать 100 символов' }),
});
// Тип данных формы входа, выведенный из схемы
export type LoginFormData = z.infer<typeof loginSchema>;
// Схема валидации для формы регистрации партнера
export const partnerRegisterSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email обязателен' })
    .email({ message: 'Некорректный формат email' })
    .max(255, { message: 'Email не должен превышать 255 символов' }),
  password: z
    .string()
    .min(6, { message: 'Пароль должен содержать минимум 6 символов' })
    .max(100, { message: 'Пароль не должен превышать 100 символов' }),
  fullName: z
    .string()
    .min(1, { message: 'ФИО обязательно' })
    .max(255, { message: 'ФИО не должно превышать 255 символов' }),
  companyName: z
    .string()
    .min(1, { message: 'Название компании обязательно' })
    .max(255, { message: 'Название компании не должно превышать 255 символов' }),
  legalAddress: z
    .string()
    .min(1, { message: 'Юридический адрес обязателен' })
    .max(500, { message: 'Юридический адрес не должен превышать 500 символов' }),
});
// Тип данных формы регистрации партнера, выведенный из схемы
export type PartnerRegisterFormData = z.infer<typeof partnerRegisterSchema>;
// Схема валидации для формы восстановления пароля
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email обязателен' })
    .email({ message: 'Некорректный формат email' })
    .max(255, { message: 'Email не должен превышать 255 символов' }),
});
// Тип данных формы восстановления пароля, выведенный из схемы
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
// Схема валидации для формы сброса пароля
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email обязателен' })
    .email({ message: 'Некорректный формат email' })
    .max(255, { message: 'Email не должен превышать 255 символов' }),
  resetCode: z.string().min(1, { message: 'Код сброса пароля обязателен' }),
  newPassword: z
    .string()
    .min(6, { message: 'Пароль должен содержать минимум 6 символов' })
    .max(100, { message: 'Пароль не должен превышать 100 символов' }),
});
// Тип данных формы сброса пароля, выведенный из схемы
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Схема валидации для формы входа водителя
export const driverLoginSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, { message: 'Номер телефона обязателен' })
    .max(63, { message: 'Номер телефона не должен превышать 63 символа' })
    .regex(/^\+?[0-9\s\-()]+$/, { message: 'Некорректный формат номера телефона' }),
  licensePlate: z
    .string()
    .min(1, { message: 'Гос. номер обязателен' })
    .max(15, { message: 'Гос. номер не должен превышать 15 символов' }),
  password: z
    .string()
    .min(6, { message: 'Пароль должен содержать минимум 6 символов' })
    .max(100, { message: 'Пароль не должен превышать 100 символов' }),
  twoFactorCode: z.string().optional().nullable(),
  twoFactorRecoveryCode: z.string().optional().nullable(),
});
// Тип данных формы входа водителя
export type DriverLoginFormData = z.infer<typeof driverLoginSchema>;

// Схема валидации для формы входа терминала
export const terminalLoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email обязателен' })
    .email({ message: 'Некорректный формат email' }),
  password: z
    .string()
    .min(6, { message: 'Пароль должен содержать минимум 6 символов' })
    .max(100, { message: 'Пароль не должен превышать 100 символов' }),
  twoFactorCode: z.string().optional().nullable(),
  twoFactorRecoveryCode: z.string().optional().nullable(),
});
// Тип данных формы входа терминала
export type TerminalLoginFormData = z.infer<typeof terminalLoginSchema>;
