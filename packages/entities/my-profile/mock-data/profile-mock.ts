import { Role } from '@entities/users/enums';
import type { GetUserSelfProfileDTO } from '@entities/users/interface';

// Импортируем отдельные mock данные
import { mockAdminProfile } from './admin-mock';
import { mockCustomerProfile } from './customer-mock';
import { mockDriverProfile } from './driver-mock';
import { mockOperatorProfile } from './operator-mock';
import { mockPartnerProfile } from './partner-mock';
import { mockTerminalProfile } from './terminal-mock';

// Экспортируем все mock профили
export {
  mockAdminProfile,
  mockDriverProfile,
  mockOperatorProfile,
  mockPartnerProfile,
  mockTerminalProfile,
  mockCustomerProfile,
};

/**
 * Функция для получения mock данных в зависимости от роли
 */
export const getMockProfileByRole = (role: Role): GetUserSelfProfileDTO => {
  switch (role) {
    case Role.Admin:
      return mockAdminProfile;
    case Role.Driver:
      return mockDriverProfile;
    case Role.Operator:
      return mockOperatorProfile;
    case Role.Partner:
      return mockPartnerProfile;
    case Role.Terminal:
      return mockTerminalProfile;
    case Role.Customer:
      return mockCustomerProfile;
    default:
      return mockAdminProfile; // По умолчанию возвращаем админа
  }
};

/**
 * Список всех доступных ролей для переключения
 */
export const availableRoles = [
  { role: Role.Admin, label: 'Администратор' },
  { role: Role.Driver, label: 'Водитель' },
  { role: Role.Operator, label: 'Оператор' },
  { role: Role.Partner, label: 'Контр-агент' },
  { role: Role.Terminal, label: 'Терминал' },
  { role: Role.Customer, label: 'Клиент' },
] as const;

/**
 * Текущий mock профиль (можно изменить для тестирования разных ролей)
 */
export const currentMockProfile: GetUserSelfProfileDTO = mockAdminProfile;
