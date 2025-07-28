import { cookies } from 'next/headers';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { DynamicScale } from '@shared/components/DynamicScale';
import { ThemeProvider } from '@shared/theme/ThemeProvider';
import { ToastManager } from '@shared/toast/ToastManager';
import '@shared/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();
  
  // Читаем масштаб из куки на сервере (по умолчанию 0.8 для водителей)
  const cookieStore = await cookies();
  const scaleCookie = cookieStore.get('driver-ui-scale');
  const scale = scaleCookie ? parseFloat(scaleCookie.value) : 0.8;

  return (
    <html lang={locale}>
      <head>
        <meta
          name="viewport"
          content="width=1280, height=720, initial-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <DynamicScale scale={scale} />
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
          <ToastManager />
        </ThemeProvider>
      </body>
    </html>
  );
}
