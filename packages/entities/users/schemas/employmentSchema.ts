import { z } from 'zod';
import { EmploymentType } from '@entities/users/enums';

/**
 * Схема валидации для трудоустройства
 */
export const employmentSchema = z.object({
  companyName: z
    .string()
    .min(1, { message: 'Название компании обязательно' })
    .max(255, { message: 'Название компании не должно превышать 255 символов' }),
  employmentType: z.union([
    z.nativeEnum(EmploymentType),
    z.string()
  ], {
    message: 'Выберите тип занятости',
  }),
  percentage: z
    .number()
    .min(0, { message: 'Процент не может быть отрицательным' })
    .max(100, { message: 'Процент от выручки за один заказ не может быть больше 100' })
    .nullable()
    .optional(),
  fixedAmount: z
    .number()
    .min(0, { message: 'Фиксированная сумма не может быть отрицательной' })
    .max(10000, { message: 'Фиксированная выручка от одного заказа не может быть больше 10000' })
    .nullable()
    .optional(),
}).refine((data) => {
  // Если выбран процентный тип, процент должен быть указан
  if (data.employmentType === EmploymentType.Percentage) {
    return data.percentage !== null && data.percentage !== undefined;
  }
  // Если выбран фиксированный тип, сумма должна быть указана
  if (data.employmentType === EmploymentType.FixedAmount) {
    return data.fixedAmount !== null && data.fixedAmount !== undefined;
  }
  return true;
}, {
  message: 'Заполните соответствующее поле для выбранного типа занятости',
  path: ['employmentType'], // Ошибка будет показана на поле типа занятости
});

/**
 * Тип данных трудоустройства, выведенный из схемы
 */
export type EmploymentFormData = z.infer<typeof employmentSchema>;
