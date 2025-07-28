import { getRawCookie } from '@shared/lib/parse-cookie';
import { SheetProvider } from '@shared/lib/sheet-context';
import { SidebarInset, SidebarProvider } from '@shared/ui/layout/sidebar';
import { SiteHeader } from '@widgets/header';
import { AppSidebar } from '@widgets/sidebar';

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const _accessToken = await getRawCookie('.AspNetCore.Identity.Application');

  // Получаем настройки фона из куки
  const backgroundType = (await getRawCookie('driver-background-type')) || 'color';
  const backgroundValue = (await getRawCookie('driver-background-value')) || '#f9fafb';

  // Получаем настройки масштаба из куки
  const _scaleStr = (await getRawCookie('driver-ui-scale')) || '0.8';
  const _scale = parseFloat(_scaleStr);

  // Получаем настройки оверлея планшета из куки
  const overlayOpacityStr = (await getRawCookie('driver-overlay-opacity')) || '0.95';
  const overlayBlurStr = (await getRawCookie('driver-overlay-blur')) || '4';
  const overlayColor = (await getRawCookie('driver-overlay-color')) || '#ffffff'; // По умолчанию белый
  const overlayOpacity = parseFloat(overlayOpacityStr);
  const overlayBlur = parseFloat(overlayBlurStr);

  // Получаем настройки оверлея компонентов из куки
  const componentOpacityStr = (await getRawCookie('driver-component-opacity')) || '0.9';
  const componentBlurStr = (await getRawCookie('driver-component-blur')) || '8';
  const componentOpacity = parseFloat(componentOpacityStr);
  const componentBlur = parseFloat(componentBlurStr);

  // Функция для конвертации HEX в RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 255, g: 255, b: 255 }; // fallback to white
  };

  const overlayRgb = hexToRgb(overlayColor);

  // Стили для компонентов с оверлеем (БЕЗ масштабирования)
  const componentOverlayStyle = {
    backgroundColor: `rgba(255, 255, 255, ${componentOpacity})`,
    backdropFilter: `blur(${componentBlur}px)`,
    WebkitBackdropFilter: `blur(${componentBlur}px)`,
  };

  return (
    <div
      className='mx-auto my-auto flex overflow-hidden w-full h-full'
      style={{
        ...(backgroundType === 'image'
          ? {
              backgroundImage: `url(${backgroundValue})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
            }
          : {
              backgroundColor: backgroundValue,
            }),
      }}
    >
      <div
        className='mx-auto my-auto w-full h-full flex flex-row gap-4 overflow-hidden p-5'
        style={{
          // Используем настраиваемый цвет планшета!
          backgroundColor: `rgba(${overlayRgb.r}, ${overlayRgb.g}, ${overlayRgb.b}, ${overlayOpacity})`,
          backdropFilter: `blur(${overlayBlur}px)`,
          WebkitBackdropFilter: `blur(${overlayBlur}px)`,
          // Применяем масштаб только к содержимому планшета
          transformOrigin: 'center center',
        }}
      >
        <SheetProvider>
          <SidebarProvider defaultOpen>
            <AppSidebar />
            <SidebarInset>
              <div className='rounded-2xl' style={componentOverlayStyle}>
                <SiteHeader />
              </div>
              <div
                className='flex-1 overflow-auto border bg-white rounded-2xl md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-[0_10px_40px_rgba(255,255,255,0.3)] scrollbar-hide'
                style={componentOverlayStyle}
              >
                {children}
              </div>
            </SidebarInset>
          </SidebarProvider>
        </SheetProvider>
      </div>
    </div>
  );
}
