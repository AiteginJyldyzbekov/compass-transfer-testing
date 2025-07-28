import type { FormChapter } from '@shared/ui/layout/form-sidebar';

/**
 * Главы формы для тарифов
 */
export const TARIFF_FORM_CHAPTERS = {
  CREATE: [
    {
      id: 'basic',
      title: 'Основная информация',
      description: 'Название, класс обслуживания и тип автомобиля',
    },
    {
      id: 'pricing',
      title: 'Ценообразование',
      description: 'Цены и параметры тарификации',
    },
  ] as FormChapter[],
  
  EDIT: [
    {
      id: 'basic',
      title: 'Основная информация',
      description: 'Название, класс обслуживания и тип автомобиля',
    },
    {
      id: 'pricing',
      title: 'Ценообразование',
      description: 'Цены и параметры тарификации',
    },
  ] as FormChapter[],
};
