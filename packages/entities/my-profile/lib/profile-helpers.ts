import { Role } from '@entities/users/enums';
import type { GetUserSelfProfileDTO } from '@entities/users/interface';

export const getStatusColor = (online?: boolean | null): string => {
  if (online === true) return 'bg-green-100 text-green-800';
  if (online === false) return 'bg-gray-100 text-gray-800';

  return 'bg-yellow-100 text-yellow-800';
};

export const getStatusLabel = (online?: boolean | null): string => {
  console.log('getStatusLabel - online value:', online, 'type:', typeof online);

  if (online === true) return 'Онлайн';
  if (online === false) return 'Оффлайн';

  return 'Неизвестно';
};

export const formatDate = (dateString?: string | null): string => {
  if (!dateString) return 'Не указано';

  try {
    const date = new Date(dateString);

    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Неверный формат даты';
  }
};

export const formatPhoneNumber = (phone?: string | null): string => {
  if (!phone) return 'Не указан';

  return phone;
};

export const isDriverProfile = (
  profile: GetUserSelfProfileDTO,
): profile is GetUserSelfProfileDTO & { role: Role.Driver } => {
  return profile.role === Role.Driver;
};

export const isAdminProfile = (
  profile: GetUserSelfProfileDTO,
): profile is GetUserSelfProfileDTO & { role: Role.Admin } => {
  return profile.role === Role.Admin;
};

export const isOperatorProfile = (
  profile: GetUserSelfProfileDTO,
): profile is GetUserSelfProfileDTO & { role: Role.Operator } => {
  return profile.role === Role.Operator;
};

export const isPartnerProfile = (
  profile: GetUserSelfProfileDTO,
): profile is GetUserSelfProfileDTO & { role: Role.Partner } => {
  return profile.role === Role.Partner;
};

export const isTerminalProfile = (
  profile: GetUserSelfProfileDTO,
): profile is GetUserSelfProfileDTO & { role: Role.Terminal } => {
  return profile.role === Role.Terminal;
};

export const isCustomerProfile = (
  profile: GetUserSelfProfileDTO,
): profile is GetUserSelfProfileDTO & { role: Role.Customer } => {
  return profile.role === Role.Customer;
};
