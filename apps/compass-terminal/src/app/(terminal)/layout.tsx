import {
  SignalRProvider,
  TerminalDataProvider,
  TerminalTariffProvider,
  TerminalLocationsProvider,
} from '@app/providers';
import { getRawCookie } from '@shared/lib/parse-cookie';
import { TerminalReceiptProvider } from '@entities/orders/context';
import { TerminalFooter } from '@widgets/footer/ui/TerminalFooter';
import { HeroBanner } from '@widgets/hero-banner';
import { initializeTerminalComponents } from '@compass-terminal/config/register-terminal-components';

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const accessToken = await getRawCookie('.AspNetCore.Identity.Application');

  return (
    <SignalRProvider accessToken={accessToken || undefined}>
      <TerminalDataProvider>
        <TerminalTariffProvider>
          <TerminalLocationsProvider>
            <TerminalReceiptProvider>
              <div className='h-full flex flex-col'>
                <HeroBanner />

                {/* Основной контент - занимает оставшееся пространство */}
                <main className='flex flex-col flex-1 items-center justify-start overflow-y-auto py-10'>
                  {children}
                </main>

                {/* Footer - всегда внизу */}
                <TerminalFooter />
              </div>
            </TerminalReceiptProvider>
          </TerminalLocationsProvider>
        </TerminalTariffProvider>
      </TerminalDataProvider>
    </SignalRProvider>
  );
}

// Инициализируем компоненты терминала при загрузке модуля
initializeTerminalComponents();
