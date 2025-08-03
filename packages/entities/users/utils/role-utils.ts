import { Role } from '../enums';

/**
 * Получение названия роли в родительном падеже (для фраз типа "Ошибка загрузки оператора")
 */
export const getRoleLabel = (role: keyof typeof Role): string => {
  const roleLabels = {
    [Role.Operator]: 'оператора',
    [Role.Driver]: 'водителя',
    [Role.Customer]: 'клиента',
    [Role.Admin]: 'администратора',
    [Role.Partner]: 'партнера',
    [Role.Terminal]: 'терминала',
    [Role.Unknown]: 'пользователя',
  };

  return roleLabels[role] || 'пользователя';
};

/**
 * Получение заголовка страницы для профиля пользователя
 */
export const getPageTitle = (role: keyof typeof Role): string => {
  const roleTitles = {
    [Role.Operator]: 'Профиль оператора',
    [Role.Driver]: 'Профиль водителя',
    [Role.Customer]: 'Профиль клиента',
    [Role.Admin]: 'Профиль администратора',
    [Role.Partner]: 'Профиль партнера',
    [Role.Terminal]: 'Профиль терминала',
    [Role.Unknown]: 'Профиль пользователя',
  };

  return roleTitles[role] || 'Профиль пользователя';
};

/**
 * Получение названия роли в именительном падеже (для отображения в UI)
 */
export const getRoleDisplayName = (role: keyof typeof Role): string => {
  const roleDisplayNames = {
    [Role.Operator]: 'Оператор',
    [Role.Driver]: 'Водитель',
    [Role.Customer]: 'Клиент',
    [Role.Admin]: 'Администратор',
    [Role.Partner]: 'Контр-агент',
    [Role.Terminal]: 'Терминал',
    [Role.Unknown]: 'Пользователь',
  };

  return roleDisplayNames[role] || 'Пользователь';
};

/**
 * Получение цвета для роли (для Badge компонентов)
 */
export const getRoleColor = (role: keyof typeof Role): string => {
  const colors = {
    [Role.Admin]: 'bg-red-100 text-red-800',
    [Role.Operator]: 'bg-blue-100 text-blue-800',
    [Role.Driver]: 'bg-green-100 text-green-800',
    [Role.Customer]: 'bg-gray-100 text-gray-800',
    [Role.Partner]: 'bg-purple-100 text-purple-800',
    [Role.Terminal]: 'bg-orange-100 text-orange-800',
    [Role.Unknown]: 'bg-gray-100 text-gray-800',
  };

  return colors[role] || 'bg-gray-100 text-gray-800';
};

/**
 * Получение инициалов из полного имени
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
