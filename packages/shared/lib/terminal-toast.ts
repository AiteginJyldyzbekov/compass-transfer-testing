/**
 * Умная система toast для терминала
 * Показывает только определенные уведомления, остальные игнорирует
 */

import { toast as realToast } from 'sonner';

// Список разрешенных типов уведомлений для терминала
const ALLOWED_TOAST_TYPES = [
  'payment_cancelled', // Отмена платежа
  'order_cancelled',   // Отмена заказа
  'payment_success',   // Успешная оплата
  'order_success',     // Успешный заказ
];

// Список запрещенных сообщений (содержат эти фразы)
const BLOCKED_MESSAGES = [
  'не удалось получить',
  'не удалось найти',
  'ошибка получения',
  'ошибка загрузки',
  'driver not found',
  'drivers not found',
  'не удалось создать',
  'failed to create',
  'failed to get',
  'failed to load',
  'error loading',
  'loading error',
  'connection error',
  'ошибка соединения',
  'network error',
  'ошибка сети',
  'timeout',
  'таймаут',
  'unauthorized',
  'не авторизован',
  'forbidden',
  'запрещено',
  'not found',
  'не найдено',
  'validation error',
  'ошибка валидации',
  'invalid',
  'неверный',
  'malformed',
  'некорректный',
];

/**
 * Проверяет, разрешено ли показывать уведомление
 */
const isAllowedToast = (message: string, options?: any): boolean => {
  // Если указан специальный тип в опциях, проверяем его
  if (options?.type && ALLOWED_TOAST_TYPES.includes(options.type)) {
    return true;
  }

  // Проверяем, не содержит ли сообщение запрещенные фразы
  const lowerMessage = message.toLowerCase();
  const isBlocked = BLOCKED_MESSAGES.some(blockedPhrase => 
    lowerMessage.includes(blockedPhrase.toLowerCase())
  );

  return !isBlocked;
};

/**
 * Умный toast для терминала
 */
const terminalToast = {
  success: (message: string, options?: any) => {
    if (isAllowedToast(message, options)) {
      realToast.success(message, options);
    } else {
      console.log('[Terminal] Toast blocked - Success:', message);
    }
  },

  error: (message: string, options?: any) => {
    if (isAllowedToast(message, options)) {
      realToast.error(message, options);
    } else {
      console.log('[Terminal] Toast blocked - Error:', message);
    }
  },

  warning: (message: string, options?: any) => {
    if (isAllowedToast(message, options)) {
      realToast.warning(message, options);
    } else {
      console.log('[Terminal] Toast blocked - Warning:', message);
    }
  },

  info: (message: string, options?: any) => {
    if (isAllowedToast(message, options)) {
      realToast.info(message, options);
    } else {
      console.log('[Terminal] Toast blocked - Info:', message);
    }
  },

  loading: (message: string, options?: any) => {
    if (isAllowedToast(message, options)) {
      realToast.loading(message, options);
    } else {
      console.log('[Terminal] Toast blocked - Loading:', message);
    }
  },

  dismiss: (toastId?: string) => {
    realToast.dismiss(toastId);
  },

  promise: (promise: Promise<any>, messages: any) => {
    console.log('[Terminal] Toast disabled - Promise:', messages);
    return promise;
  },

  custom: (jsx: any, options?: any) => {
    console.log('[Terminal] Toast disabled - Custom:', jsx);
  },
};

export { terminalToast };
export default terminalToast;
