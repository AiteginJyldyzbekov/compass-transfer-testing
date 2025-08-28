import { NotificationProvider, SignalRProvider } from '@app/providers';
import { getRawCookie } from '@shared/lib/parse-cookie';
import { IncomingOrderModal } from '@features/incoming-order';
import { LocationProvider } from '@features/location-tracking';
import { NotificationsProvider } from '@features/notifications';
import { DriverMobileFooter, FooterSpacer } from '@widgets/footer';
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
        <NotificationsProvider>
          <LocationProvider intervalMs={30000}>
            <div className='flex flex-col h-screen'>
              <DriverMobileHeader />
              <main className='flex-1 overflow-y-auto'>{children}</main>
              <FooterSpacer />
              <DriverMobileFooter />

              {/* Модальное окно для входящих заказов - теперь самодостаточное */}
              <IncomingOrderModal />
            </div>
          </LocationProvider>
        </NotificationsProvider>
      </NotificationProvider>
    </SignalRProvider>
  );
}
