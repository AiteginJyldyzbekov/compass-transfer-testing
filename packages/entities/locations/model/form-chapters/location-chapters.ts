import type { FormChapter } from '@shared/ui/layout/form-sidebar';

/**
 * Главы формы для локаций
 */
export const LOCATION_FORM_CHAPTERS = {
  CREATE: [
    {
      id: 'basic',
      title: 'Основная информация',
      description: 'Название, описание, тип и адрес локации',
    },
    {
      id: 'coordinates',
      title: 'Координаты и настройки',
      description: 'Географические координаты и параметры локации',
    },
  ] as FormChapter[],
  
  EDIT: [
    {
      id: 'basic',
      title: 'Основная информация',
      description: 'Название, описание, тип и адрес локации',
    },
    {
      id: 'coordinates',
      title: 'Координаты и настройки',
      description: 'Географические координаты и параметры локации',
    },
  ] as FormChapter[],
};
