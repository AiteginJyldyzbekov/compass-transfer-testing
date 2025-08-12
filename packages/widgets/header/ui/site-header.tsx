'use client';

import { Bell } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { notificationsEvents } from '@shared/lib/notifications-events';
import { Badge } from '@shared/ui/data-display/badge';
import { Button } from '@shared/ui/forms/button';
import { Separator } from '@shared/ui/layout/separator';
import { SidebarTrigger } from '@shared/ui/layout/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@shared/ui/navigation/breadcrumb';
import { useNotifications } from '@features/notifications/hooks/useNotifications';
import { NotificationsSheet } from '@features/sheet';
import { CurrencyWidget } from '@widgets/currency';
import { WeatherWidget } from '@widgets/weather';

export function SiteHeader() {
  const pathname = usePathname();
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);

  // Используем хук для получения уведомлений
  const { unreadCount, actions: { loadNotifications } } = useNotifications();

  // Загружаем уведомления при монтировании
  React.useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Подписываемся на события обновления уведомлений из других компонентов
  React.useEffect(() => {
    const unsubscribe = notificationsEvents.subscribe(() => {
      loadNotifications();
    });

    return unsubscribe;
  }, [loadNotifications]);

  // Перезагружаем уведомления при закрытии Sheet для обновления badge
  React.useEffect(() => {
    if (!isNotificationsOpen) {
      // Небольшая задержка для завершения анимации закрытия
      const timer = setTimeout(() => {
        loadNotifications();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isNotificationsOpen, loadNotifications]);

  // Периодически обновляем уведомления для синхронизации badge
  React.useEffect(() => {
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000); // Обновляем каждые 30 секунд

    return () => clearInterval(interval);
  }, [loadNotifications]);



  // Преобразуем путь в breadcrumb элементы
  const pathSegments = pathname.split('/').filter(Boolean);

  // Создаем breadcrumb структуру
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const isLast = index === pathSegments.length - 1;

    // Красивые названия для сегментов
    const segmentName = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      href,
      name: segmentName,
      isLast,
    };
  });

  // Если мы на главной странице, показываем Dashboard
  if (pathSegments.length === 0) {
    breadcrumbItems.push({ href: '/', name: 'Dashboard', isLast: true });
  }

  return (
    <>
      <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
        <div className='flex items-center gap-2 px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2 h-4' />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href='/'>Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {breadcrumbItems.map(item => (
                <React.Fragment key={item.href}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {item.isLast ? (
                      <BreadcrumbPage>{item.name}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link href={item.href}>{item.name}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className='ml-auto px-3 flex items-center gap-2'>
          {/* Виджет курса валют - инициализируется сразу */}
          <CurrencyWidget />

          {/* Виджет погоды */}
          <WeatherWidget />

          {/* Кнопка уведомлений */}
          <Button
            variant='ghost'
            size='sm'
            className='relative'
            onClick={() => setIsNotificationsOpen(true)}
          >
            <Bell className='h-4 w-4' />
            {unreadCount > 0 && (
              <Badge
                variant='destructive'
                className='absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center'
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      {/* NotificationsSheet компонент */}
      <NotificationsSheet
        open={isNotificationsOpen}
        onOpenChange={setIsNotificationsOpen}
      />
    </>
  );
}
