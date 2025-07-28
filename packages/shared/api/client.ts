import axios, {
  isAxiosError,
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

// Базовый URL API
const getApiUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    (() => {
      throw new Error('API URL is not defined in env (NEXT_PUBLIC_API_URL)');
    })()
  );
};

const API_URL = getApiUrl();

// Типы ошибок API
export enum ApiErrorType {
  Network = 'network',
  Auth = 'auth',
  Forbidden = 'forbidden',
  NotFound = 'not_found',
  Validation = 'validation',
  Server = 'server',
  Unknown = 'unknown',
}
// Интерфейс для обработанной ошибки API
export interface ApiError {
  type: ApiErrorType;
  message: string;
  statusCode?: number;
  data?: unknown;
  errors?: Record<string, string[]>; // Добавляем поле для хранения детальных ошибок
  originalError: Error | AxiosError | unknown;
}
// Типы для запросов и ответов
export type ApiResponse<T> = Promise<T>;
// Результат API запроса
export interface ApiResult<T> {
  data?: T;
  error?: ApiError;
}
// Обработчики ошибок
export interface ApiErrorHandlers {
  onError?: (error: ApiError) => void;
  onAuthError?: (error: ApiError) => void;
  onForbiddenError?: (error: ApiError) => void;
  onNotFoundError?: (error: ApiError) => void;
  onValidationError?: (error: ApiError) => void;
  onServerError?: (error: ApiError) => void;
  onNetworkError?: (error: ApiError) => void;
}
// Конфигурация для создания API клиента
export interface ApiClientConfig extends AxiosRequestConfig {
  errorHandlers?: ApiErrorHandlers;
}
/**
 * Обрабатывает ошибку API и возвращает объект ApiError
 */
export const handleApiError = (error: unknown): ApiError => {
  // Если это ошибка Axios
  if (isAxiosError(error)) {
    const statusCode = error.response?.status;
    // Определяем тип ошибки на основе статус-кода
    let type = ApiErrorType.Unknown;
    let message = error.message;
    let errors: Record<string, string[]> | undefined;

    // Извлекаем детальные ошибки из ответа сервера, если они есть
    if (error.response?.data) {
      const responseData = error.response.data;

      // Проверяем наличие поля errors в ответе
      if (responseData.errors && typeof responseData.errors === 'object') {
        errors = responseData.errors as Record<string, string[]>;
        // Формируем сообщение об ошибке на основе первой ошибки
        if (errors && Object.keys(errors).length > 0) {
          const firstErrorKey = Object.keys(errors)[0];

          if (firstErrorKey && errors[firstErrorKey]?.length > 0) {
            message = errors[firstErrorKey][0];
          }
        }
      }
      // Если есть title в ответе, используем его как основное сообщение
      if (responseData.title && typeof responseData.title === 'string') {
        message = responseData.title;
      }
    }
    switch (statusCode) {
      case 401:
        type = ApiErrorType.Auth;
        if (!errors) message = 'Ошибка авторизации. Пожалуйста, войдите в систему.';
        break;
      case 403:
        type = ApiErrorType.Forbidden;
        if (!errors) message = 'Доступ запрещен. У вас нет прав для выполнения этого действия.';
        break;
      case 404:
        type = ApiErrorType.NotFound;
        if (!errors) message = 'Ресурс не найден.';
        break;
      case 400:
      case 422:
        type = ApiErrorType.Validation;
        if (!errors) message = 'Ошибка валидации данных.';
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        type = ApiErrorType.Server;
        if (!errors) message = 'Ошибка сервера. Пожалуйста, попробуйте позже.';
        break;
      default:
        if (!statusCode) {
          type = ApiErrorType.Network;
          if (!errors) message = 'Ошибка сети. Пожалуйста, проверьте подключение к интернету.';
        } else if (statusCode >= 400 && statusCode < 500) {
          type = ApiErrorType.Validation;
          if (!errors) message = 'Ошибка в запросе.';
        } else if (statusCode >= 500) {
          type = ApiErrorType.Server;
          if (!errors) message = 'Ошибка сервера. Пожалуйста, попробуйте позже.';
        }
    }

    // Возвращаем обработанную ошибку
    return {
      type,
      message,
      statusCode,
      data: error.response?.data,
      errors,
      originalError: error,
    };
  }
  // Если это обычная ошибка JavaScript
  if (error instanceof Error) {
    return {
      type: ApiErrorType.Unknown,
      message: error.message,
      originalError: error,
    };
  }

  // Если это неизвестный тип ошибки
  return {
    type: ApiErrorType.Unknown,
    message: 'Произошла неизвестная ошибка',
    originalError: error,
  };
};
/**
 * Создает и настраивает экземпляр axios для работы с API
 */
export const createApiClient = (config?: ApiClientConfig): AxiosInstance => {
  const errorHandlers = config?.errorHandlers || {};
  // Создаем экземпляр axios с базовыми настройками
  const client = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Для работы с cookies
    headers: {
      'Content-Type': 'application/json',
    },
    paramsSerializer: {
      serialize: (params) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            // Для массивов добавляем каждое значение отдельно без []
            value.forEach(item => {
              if (item !== null && item !== undefined && item !== '') {
                searchParams.append(key, String(item));
              }
            });
          } else if (value !== null && value !== undefined && value !== '') {
            searchParams.append(key, String(value));
          }
        });

        return searchParams.toString();
      }
    },
    ...config,
  });

  // Перехватчик запросов
  client.interceptors.request.use(
    config => {
      // Авторизация работает через cookies, которые автоматически
      // отправляются с запросами благодаря настройке withCredentials: true

      // Примечание: заголовок Origin устанавливается браузером автоматически
      // и не должен быть установлен вручную, так как это приведет к ошибке
      // "Refused to set unsafe header "Origin""
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );
  // Перехватчик ответов для обработки ошибок
  client.interceptors.response.use(
    response => {
      return response;
    },
    (error: unknown) => {
      // Обрабатываем ошибку
      const apiError = handleApiError(error);

      // Вызываем соответствующие обработчики ошибок
      if (errorHandlers.onError) {
        errorHandlers.onError(apiError);
      }
      // Вызываем специфичный обработчик в зависимости от типа ошибки
      switch (apiError.type) {
        case ApiErrorType.Auth:
          errorHandlers.onAuthError?.(apiError);
          break;
        case ApiErrorType.Forbidden:
          errorHandlers.onForbiddenError?.(apiError);
          break;
        case ApiErrorType.NotFound:
          errorHandlers.onNotFoundError?.(apiError);
          break;
        case ApiErrorType.Validation:
          errorHandlers.onValidationError?.(apiError);
          break;
        case ApiErrorType.Server:
          errorHandlers.onServerError?.(apiError);
          break;
        case ApiErrorType.Network:
          errorHandlers.onNetworkError?.(apiError);
          break;
      }

      return Promise.reject(apiError);
    },
  );

  return client;
};
// Создаем экземпляр API клиента с базовыми настройками
const apiClient = createApiClient();

/**
 * Выполняет API запрос и возвращает результат в формате { data, error }
 */
export const executeApiRequest = async <T>(requestFn: () => Promise<T>): Promise<ApiResult<T>> => {
  try {
    const data = await requestFn();

    return { data };
  } catch (error) {
    // Если ошибка уже обработана в перехватчике, она будет иметь тип ApiError
    if (error && typeof error === 'object' && 'type' in error) {
      return { error: error as ApiError };
    }

    // Иначе обрабатываем ошибку
    return { error: handleApiError(error) };
  }
};
/**
 * Типизированные методы для работы с API
 */
// GET запрос
export const apiGet = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> => {
  return executeApiRequest(async () => {
    const response = await apiClient.get<T, AxiosResponse<T>>(url, config);

    return response.data;
  });
};
// POST запрос
// Примечание: некоторые эндпоинты (например, авторизация) могут возвращать только статус 200 без данных
export const apiPost = async <T, D = Record<string, unknown>>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> => {
  return executeApiRequest(() =>
    apiClient.post<T, AxiosResponse<T>, D>(url, data, config).then(response => response.data),
  );
};
// PUT запрос
export const apiPut = async <T, D = Record<string, unknown>>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> => {
  return executeApiRequest(() =>
    apiClient.put<T, AxiosResponse<T>, D>(url, data, config).then(response => response.data),
  );
};
// DELETE запрос
export const apiDelete = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> => {
  return executeApiRequest(() =>
    apiClient.delete<T, AxiosResponse<T>>(url, config).then(response => response.data),
  );
};
// PATCH запрос
export const apiPatch = async <T, D = Record<string, unknown>>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig,
): Promise<ApiResult<T>> => {
  return executeApiRequest(() =>
    apiClient.patch<T, AxiosResponse<T>, D>(url, data, config).then(response => response.data),
  );
};
// Экспортируем клиент и методы
const api = {
  client: apiClient,
  get: apiGet,
  post: apiPost,
  put: apiPut,
  patch: apiPatch,
  delete: apiDelete,
};

export default api;
// Экспортируем функцию для проверки типа ошибки Axios
export { isAxiosError };
