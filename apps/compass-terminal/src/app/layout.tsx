import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { PaymentProvider } from '@app/providers/PaymentProvider';
import '@shared/styles/globals.css';
import '@shared/styles/welcomePage.css';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className='h-full'>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='icon' href='/favicon.ico' />
      </head>
      <body className='h-full'>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <PaymentProvider>
            {children}
          </PaymentProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
