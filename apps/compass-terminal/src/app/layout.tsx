import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { ThemeProvider } from '@shared/theme/ThemeProvider';
import { ToastManager } from '@shared/toast/ToastManager';
import '@shared/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <link
          rel="icon"
          href="/favicon.ico"
        />
      </head>
      <body className="h-full">
        <ThemeProvider>
          <NextIntlClientProvider
            locale={locale}
            messages={messages}
          >
            {children}
          </NextIntlClientProvider>
          <ToastManager />
        </ThemeProvider>
      </body>
    </html>
  );
}
