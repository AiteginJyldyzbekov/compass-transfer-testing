import { Role } from '@entities/users/enums/Role.enum';
import { parseCookie } from '../parse-сookie';

/**
 * Проверяет, является ли значение допустимым значением Role
 * @param {unknown} value Значение для проверки
 * @returns {boolean} true, если значение допустимо
 */
function isRole(value: unknown): value is Role {
  return Object.values(Role).includes(value as Role);
}

// Интерфейс для пользователя
export interface User {
  id: string;
  fullName: string;
  role: Role;
  email: string;
}
/**S
 * Извлекает данные пользователя из JWT токена в куки
 * @param cookieData - Данные из JWT токена
 * @returns Объект пользователя или nullS
 */
export function extractUserFromCookie(cookieData: Record<string, unknown> | null): User | null {
  if (!cookieData) {
    return null;
  }
  // Извлекаем данные пользователя из JWT токена
  const userId = String(
    cookieData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || '',
  );
  const role = String(
    cookieData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '',
  );
  const fullName = String(
    cookieData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '',
  );

  // Пробуем найти email в разных возможных полях
  const email = String(
    cookieData['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
    cookieData['email'] ||
    cookieData['Email'] ||
    cookieData['http://schemas.microsoft.com/ws/2008/06/identity/claims/email'] ||
    '',
  );



  // Проверяем, что все необходимые данные присутствуют
  if (userId && role && isRole(role)) {
    return {
      id: userId,
      fullName: fullName,
      role: role as Role,
      email: email,
    };
  }

  return null;
}
/**
 * Получает данные пользователя или конкретное поле из куки аутентификации
 * @param options - Название куки или объект с опциями
 * @returns Объект пользователя, значение поля или null
 */
export async function getUserFromCookie(
  options?: string | { role?: unknown; id?: unknown; fullName?: unknown; cookieName?: string },
): Promise<User | Role | string | null> {
  let cookieName: string | undefined;
  let field: keyof User | undefined;

  if (typeof options === 'string') {
    // Проверяем, это поле пользователя или название куки
    if (['role', 'id', 'fullName'].includes(options)) {
      field = options as keyof User;
    } else {
      cookieName = options;
    }
  } else if (options && typeof options === 'object') {
    // Передан объект с полем
    cookieName = options.cookieName;
    // Проверяем, какое поле запрошено (независимо от значения)
    if ('role' in options) field = 'role';
    else if ('id' in options) field = 'id';
    else if ('fullName' in options) field = 'fullName';
  }
  const authCookieName =
    cookieName || process.env.AUTH_COOKIE_NAME || '.AspNetCore.Identity.Application';
  const cookieData = await parseCookie(authCookieName);
  const user = extractUserFromCookie(cookieData);

  if (field && user) {
    return user[field];
  }

  return user;
}
