'use client';

import { QueryClient, QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

/**
 * Провайдер React Query для управления серверным состоянием
 */
export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  // Создаем QueryClient только один раз при монтировании компонента
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Время, в течение которого данные считаются свежими (5 минут)
            staleTime: 5 * 60 * 1000,
            // Время кэширования данных (10 минут)
            gcTime: 10 * 60 * 1000,
            // Количество попыток повтора при ошибке
            retry: 1,
            // Не обновлять данные при фокусе окна
            refetchOnWindowFocus: false,
            // Не обновлять данные при восстановлении соединения
            refetchOnReconnect: true,
          },
          mutations: {
            // Количество попыток повтора для мутаций
            retry: 1,
          },
        },
      })
  );

  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
      {/* Добавляем DevTools только в development режиме */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </TanStackQueryClientProvider>
  );
}
