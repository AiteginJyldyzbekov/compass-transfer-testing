import type { FormChapter } from '@shared/ui/layout/form-sidebar';

/**
 * Главы формы для уведомлений
 */
export const NOTIFICATION_FORM_CHAPTERS = {
  CREATE: [
    {
      id: 'basic',
      title: 'Основная информация',
      description: 'Тип, заголовок и содержимое уведомления',
    },
    {
      id: 'relations',
      title: 'Связанные данные',
      description: 'Связи с заказами, поездками и пользователями',
    },
  ] as FormChapter[],
  
  EDIT: [
    {
      id: 'basic',
      title: 'Основная информация',
      description: 'Тип, заголовок и содержимое уведомления',
    },
    {
      id: 'relations',
      title: 'Связанные данные',
      description: 'Связи с заказами, поездками и пользователями',
    },
  ] as FormChapter[],
};
