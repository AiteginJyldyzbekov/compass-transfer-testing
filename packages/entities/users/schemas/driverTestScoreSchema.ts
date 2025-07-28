import { z } from 'zod';

/**
 * Схема валидации для результатов тестов водителя
 */
export const driverTestScoreSchema = z.object({
  testName: z
    .string()
    .min(1, { message: 'Название пройденного теста обязательно' })
    .max(127, { message: 'Название пройденного теста не должно превышать 127 символов' }),
  score: z.number({ message: 'Полученный балл должен быть числом' }),
  maxPossibleScore: z.number({ message: 'Максимально возможный балл должен быть числом' }),
  passedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Дата прохождения теста должна быть в формате YYYY-MM-DD',
  }),
  expiryDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Дата истечения срока действия теста должна быть в формате YYYY-MM-DD',
    })
    .nullable(),
  comments: z
    .string()
    .max(511, { message: 'Комментарии к результату не должны превышать 511 символов' })
    .nullable(),
});
/**
 * Тип данных результатов тестов водителя, выведенный из схемы
 */
export type DriverTestScoreFormData = z.infer<typeof driverTestScoreSchema>;
