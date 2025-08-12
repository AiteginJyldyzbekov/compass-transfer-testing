import { apiPost } from '@shared/api/client';

/**
 * Интерфейс для запроса авторизации водителя
 */
export interface DriverLoginRequest {
  phoneNumber: string;
  password: string;
  licensePlate: string;
  twoFactorCode?: string | null;
  twoFactorRecoveryCode?: string | null;
}

/**
 * Интерфейс для ответа авторизации водителя
 */
export interface DriverLoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    phoneNumber: string;
    fullName: string;
    role: string;
  };
}

/**
 * API для авторизации водителей
 */
export const driverAuthApi = {
  /**
   * Авторизация водителя
   * POST /Auth/login/driver
   */
  async login(data: DriverLoginRequest) {
    const result = await apiPost<DriverLoginResponse>('/Auth/login/driver', data as unknown as Record<string, unknown>);
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.data!;
  },
} as const;
