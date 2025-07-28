import type { FormChapter } from '@shared/ui/layout/form-sidebar';

/**
 * Главы формы для заказов
 */
export const ORDER_FORM_CHAPTERS = {
  CREATE_INSTANT: [
    {
      id: 'basic',
      title: 'Основная информация',
      description: 'Тариф, маршрут и стоимость заказа',
    },
    {
      id: 'passengers',
      title: 'Пассажиры',
      description: 'Информация о пассажирах заказа',
    },
  ] as FormChapter[],
  
  CREATE_SCHEDULED: [
    {
      id: 'basic',
      title: 'Основная информация',
      description: 'Тариф, маршрут и стоимость заказа',
    },
    {
      id: 'passengers',
      title: 'Пассажиры',
      description: 'Информация о пассажирах заказа',
    },
    {
      id: 'schedule',
      title: 'Расписание',
      description: 'Время и дополнительная информация',
    },
  ] as FormChapter[],
  
  EDIT: [
    {
      id: 'basic',
      title: 'Основная информация',
      description: 'Тариф, маршрут и стоимость заказа',
    },
    {
      id: 'passengers',
      title: 'Пассажиры',
      description: 'Информация о пассажирах заказа',
    },
  ] as FormChapter[],
};
