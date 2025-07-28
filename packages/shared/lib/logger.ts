type LogLevel = 'log' | 'warn' | 'error' | 'info';

function format(level: LogLevel, ...args: unknown[]) {
  const timestamp = new Date().toISOString();

  return [`[${timestamp}] [${level.toUpperCase()}]`, ...args];
}

export const logger = {
  log: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.log(...format('log', ...args));
  },
  info: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.info(...format('info', ...args));
  },
  warn: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.warn(...format('warn', ...args));
  },
  error: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.error(...format('error', ...args));
  },
  // Для совместимости с архитектурными правилами
  disableAll: () => {},
  enableAll: () => {},
  enableOnlyErrors: () => {},
};
