import { z } from 'zod';

/**
 * Схема валидации для опыта работы водителя
 */
export const driverWorkExperienceSchema = z.object({
  employerName: z
    .string()
    .min(1, { message: 'Название предыдущего работодателя обязательно' })
    .max(127, {
      message: 'Название предыдущего работодателя не должно превышать 127 символов',
    }),
  position: z
    .string()
    .min(1, { message: 'Должность на предыдущем месте работы обязательна' })
    .max(127, {
      message: 'Должность на предыдущем месте работы не должна превышать 127 символов',
    }),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Дата начала работы должна быть в формате YYYY-MM-DD',
  }),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Дата окончания работы должна быть в формате YYYY-MM-DD',
    })
    .nullable(),
  isCurrent: z.boolean(),
  responsibilities: z
    .string()
    .max(4095, { message: 'Основные обязанности не должны превышать 4095 символов' })
    .nullable(),
});

/**
 * Тип данных опыта работы водителя, выведенный из схемы
 */
export type DriverWorkExperienceFormData = z.infer<typeof driverWorkExperienceSchema>;
