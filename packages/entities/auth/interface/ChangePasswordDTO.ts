/**
 * Интерфейс для смены пароля пользователя
 * PATCH /Auth/manage/credentials
 * @interface ChangePasswordDTO
 */
export interface ChangePasswordDTO {
  /** Новый email (не используется для смены пароля) */
  newEmail?: string | null;

  /** Новый пароль */
  newPassword: string;

  /** Старый пароль для подтверждения */
  oldPassword: string;
}

/**
 * Интерфейс для ответа API смены пароля
 */
export interface ChangePasswordResponse {
  success: boolean;
  error?: string;
  fieldErrors?: {
    oldPassword?: boolean;
    newPassword?: boolean;
  };
}
