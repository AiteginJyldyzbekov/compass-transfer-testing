import { NotificationProvider , SignalRProvider } from '@app/providers';
import { getRawCookie } from '@shared/lib/parse-cookie';
import { DriverQueueProvider } from '@features/driver-queue';
import { IncomingOrderProvider, IncomingOrderWrapper } from '@features/incoming-order';
import { DriverMobileFooter } from '@widgets/footer';
import { DriverMobileHeader } from '@widgets/header';

interface DriverLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout для мобильного приложения водителей
 * Включает хедер и футер на всех страницах
 */
export default async function DriverLayout({ children }: DriverLayoutProps) {
  const accessToken = await getRawCookie('.AspNetCore.Identity.Application');

  return (
    <SignalRProvider accessToken={accessToken || undefined}>
      <NotificationProvider>
    <DriverQueueProvider>
      <IncomingOrderProvider>
        <div className='flex flex-col bg-gray-50 h-screen'>
          <DriverMobileHeader />
          <main className='flex-1 overflow-y-auto pb-safe'>
            {children}
          </main>
          <DriverMobileFooter />
          
          {/* Модальное окно для входящих заказов */}
          <IncomingOrderWrapper />
        </div>
      </IncomingOrderProvider>
    </DriverQueueProvider>
    </NotificationProvider>
    </SignalRProvider>
  );
}
