import type { ChangePasswordDTO } from '@entities/auth/interface/ChangePasswordDTO';
import { apiPost, apiPatch, type ApiResult } from './client';

// Типы для аутентификации
export interface LoginRequest {
  email: string;
  password: string;
  twoFactorCode?: string | null;
  twoFactorRecoveryCode?: string | null;
}

export interface LoginResponse {
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role?: string;
  };
  message?: string;
}

export interface LogoutResponse {
  message: string;
}

/**
 * Сервис для работы с аутентификацией
 */
export class AuthService {
  /**
   * Вход в систему
   */
  static async login(credentials: LoginRequest): Promise<ApiResult<LoginResponse>> {
    return apiPost<LoginResponse, LoginRequest>('/Auth/login', {
      email: credentials.email,
      password: credentials.password,
      twoFactorCode: credentials.twoFactorCode || null,
      twoFactorRecoveryCode: credentials.twoFactorRecoveryCode || null,
    });
  }

  /**
   * Выход из системы
   */
  static async logout(): Promise<ApiResult<LogoutResponse>> {
    return apiPost<LogoutResponse>('/Auth/logout');
  }

  /**
   * Проверка текущей сессии
   */
  static async checkAuth(): Promise<ApiResult<LoginResponse>> {
    return apiPost<LoginResponse>('/Auth/check');
  }

  /**
   * Обновление токена
   */
  static async refreshToken(): Promise<ApiResult<LoginResponse>> {
    return apiPost<LoginResponse>('/Auth/refresh');
  }

  /**
   * Смена пароля
   */
  static async changePassword(
    data: ChangePasswordDTO,
  ): Promise<ApiResult<{ email: string; isEmailConfirmed: boolean }>> {
    return apiPatch<{ email: string; isEmailConfirmed: boolean }, ChangePasswordDTO>(
      '/Auth/manage/credentials',
      data,
    );
  }
}
