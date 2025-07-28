import { z } from 'zod';

/**
 * Схема валидации для создания связи водитель-автомобиль
 * Используется при назначении водителя на автомобиль (POST запросы)
 * URL: POST /Car/{uuid}/drivers/{driver_id}
 * Body: boolean (активна ли связь)
 */
export const carDriverRelationCreateSchema = z.boolean({
  errorMap: () => ({ message: 'Значение должно быть булевым (true/false)' }),
});
/**
 * Схема для массового создания связей водитель-автомобиль
 * Поскольку API принимает только булево значение в теле запроса,
 * массовое создание должно выполняться через несколько отдельных POST запросов
 */
export const carDriverRelationBulkCreateSchema = z.object({
  /**
   * ID автомобиля (используется в URL)
   */
  carId: z
    .string()
    .uuid('ID автомобиля должен быть валидным UUID')
    .min(1, 'ID автомобиля обязателен'),

  /**
   * Массив ID водителей для назначения
   * Максимум 2 водителя на автомобиль
   */
  driverIds: z
    .array(z.string().uuid('ID водителя должен быть валидным UUID'))
    .min(1, 'Необходимо указать хотя бы одного водителя')
    .max(2, 'Автомобилю можно назначить максимум 2 водителей')
    .refine(ids => new Set(ids).size === ids.length, 'ID водителей не должны повторяться'),

  /**
   * Активность всех создаваемых связей
   */
  isActive: z.boolean().default(true),
});
/**
 * Типы для создания связей
 */
export type CarDriverRelationCreate = z.infer<typeof carDriverRelationCreateSchema>; // boolean
export type CarDriverRelationBulkCreate = z.infer<typeof carDriverRelationBulkCreateSchema>;
