import { z } from 'zod';

/**
 * Схема валидации для API обновления связи автомобиль-водитель
 * PUT /Car/{uuid}/drivers/{driver_id}
 *
 * Используется для активации/деактивации связи между автомобилем и водителем
 */
export const carDriverRelationUpdateApiSchema = z.boolean({
  message: 'Статус активности должен быть булевым значением (true/false)',
});

/**
 * Тип данных для API обновления связи автомобиль-водитель
 * true = активная связь, false = неактивная связь
 */
export type CarDriverRelationUpdateApiData = z.infer<typeof carDriverRelationUpdateApiSchema>;
