import type { FormChapter } from '@shared/ui/layout/form-sidebar';

/**
 * Главы формы для услуг
 */
export const SERVICE_FORM_CHAPTERS = {
  CREATE: [
    {
      id: 'basic',
      title: 'Основная информация',
      description: 'Название, описание, цена и настройки услуги',
    },
  ] as FormChapter[],
  
  EDIT: [
    {
      id: 'basic',
      title: 'Основная информация',
      description: 'Название, описание, цена и настройки услуги',
    },
  ] as FormChapter[],
};
