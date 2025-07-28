import type { GetUserBasicDTO } from '@entities/users';

/**
 * Интерфейс для ответа на запрос авторизации
 * @interface ILoginResponse
 */
export interface ILoginResponse {
  success: boolean;
  message?: string;
  user?: GetUserBasicDTO;
}
