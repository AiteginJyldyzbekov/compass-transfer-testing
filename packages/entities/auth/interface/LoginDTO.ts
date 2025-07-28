/**
 * Интерфейс для запроса авторизации пользователя
 * @interface ILoginRequest
 */
export interface ILoginRequest {
  email: string;
  password: string;
}

/**
 * Интерфейс для запроса авторизации водителя
 * @interface IDriverLoginRequest
 */
export interface IDriverLoginRequest {
  phoneNumber: string;
  licensePlate: string;
  password: string;
  twoFactorCode?: string | null;
  twoFactorRecoveryCode?: string | null;
}

/**
 * Интерфейс для запроса авторизации терминала
 * @interface ITerminalLoginRequest
 */
export interface ITerminalLoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string | null;
  twoFactorRecoveryCode?: string | null;
}
