'use client';

import {
  Bell,
  X,
  Inbox,
  Eye,
  EyeOff,
  Archive,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useSheet } from '@shared/lib/sheet-context';
import { Badge } from '@shared/ui/data-display/badge';
import { Button } from '@shared/ui/forms/button';
import { Separator } from '@shared/ui/layout/separator';
import { SidebarTrigger } from '@shared/ui/layout/sidebar';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@shared/ui/modals/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@shared/ui/modals/tooltip';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@shared/ui/navigation/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@shared/ui/navigation/dropdown-menu';
import { useNotifications } from '@features/notifications/hooks/useNotifications';
import type { GetNotificationDTO } from '@shared/api/notifications';
import { CurrencyWidget } from '@widgets/currency';
import { WeatherWidget } from '@widgets/weather';

export function SiteHeader() {
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = React.useState('all');
  const { openSheet, closeSheet, isSheetOpen } = useSheet();

  // Используем хук для получения уведомлений
  const {
    notifications: notificationsData,
    isLoading,
    unreadCount,
    actions: { loadNotifications, markAsRead, deleteNotification }
  } = useNotifications();

  // Загружаем уведомления при монтировании
  React.useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Фильтруем уведомления по категории
  const filteredNotifications = React.useMemo(() => {
    switch (activeCategory) {
      case 'unread':
        return notificationsData.filter((n: GetNotificationDTO) => !n.isRead);
      case 'read':
        return notificationsData.filter((n: GetNotificationDTO) => n.isRead);
      case 'archived':
        // Пока показываем все уведомления в архиве
        return notificationsData.filter((n: GetNotificationDTO) => n.isRead);
      case 'deleted':
        // Удаленные уведомления пока не поддерживаются API
        return [];
      default:
        return notificationsData;
    }
  }, [notificationsData, activeCategory]);

  // Категории уведомлений
  const categories = React.useMemo(
    () => [
      {
        id: 'all',
        label: 'Все',
        count: notificationsData.length,
        icon: Inbox,
      },
      {
        id: 'unread',
        label: 'Непрочитанные',
        count: notificationsData.filter((n: GetNotificationDTO) => !n.isRead).length,
        icon: EyeOff,
      },
      {
        id: 'read',
        label: 'Прочитанные',
        count: notificationsData.filter((n: GetNotificationDTO) => n.isRead).length,
        icon: Eye,
      },
      {
        id: 'archived',
        label: 'Архив',
        count: notificationsData.filter((n: GetNotificationDTO) => n.isRead).length,
        icon: Archive,
      },
      {
        id: 'deleted',
        label: 'Удаленные',
        count: 0, // Пока не поддерживается API
        icon: Trash2,
      },
    ],
    [notificationsData],
  );

  // Функции для работы с уведомлениями (используем API)
  const handleMarkAsRead = React.useCallback(async (id: string) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error('Ошибка при отметке уведомления как прочитанного:', error);
    }
  }, [markAsRead]);

  const handleDeleteNotification = React.useCallback(async (id: string) => {
    try {
      await deleteNotification(id);
    } catch (error) {
      console.error('Ошибка при удалении уведомления:', error);
    }
  }, [deleteNotification]);

  // Архивирование пока не поддерживается API, используем markAsRead
  const archiveNotification = React.useCallback(async (id: string) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error('Ошибка при архивировании уведомления:', error);
    }
  }, [markAsRead]);



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
            onClick={() => openSheet('notifications')}
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

      {isSheetOpen('notifications') && (
        <Sheet open={isSheetOpen('notifications')} onOpenChange={closeSheet}>
          <SheetContent side='right' className='w-[400px] sm:w-[540px] overflow-y-auto'>
            <SheetHeader className='flex flex-row items-center justify-between space-y-0 px-3'>
              <SheetTitle>Уведомления</SheetTitle>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => closeSheet()}
                className='h-8 w-8 p-0'
              >
                <X className='h-4 w-4' />
              </Button>
            </SheetHeader>

            <div className='flex h-full gap-4'>
              {/* Сайдбар с категориями */}
              <div className='w-16 border-r flex flex-col items-center justify-start gap-1'>
                {categories.map(category => {
                  const Icon = category.icon;

                  return (
                    <Tooltip key={category.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setActiveCategory(category.id)}
                          className={`relative w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
                            activeCategory === category.id
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <Icon className='h-4 w-4' />
                          {category.count > 0 && (
                            <Badge
                              variant='secondary'
                              className='absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center'
                            >
                              {category.count}
                            </Badge>
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side='right' align='center'>
                        {category.label}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>

              {/* Список уведомлений */}
              <div className='flex-1'>
                <div className='flex flex-col gap-4'>
                  {isLoading ? (
                    <div className='text-center py-8'>
                      <div className='animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2' />
                      <p className='text-sm text-muted-foreground'>Загрузка уведомлений...</p>
                    </div>
                  ) : filteredNotifications.length === 0 ? (
                    <div className='text-center py-8 text-gray-500'>
                      <Bell className='h-12 w-12 mx-auto mb-3 opacity-50' />
                      <p>Уведомлений нет</p>
                      <p className='text-sm'>
                        {activeCategory === 'unread'
                          ? 'Все уведомления прочитаны'
                          : 'Новых уведомлений пока нет'}
                      </p>
                    </div>
                  ) : (
                    filteredNotifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                          notification.isRead
                            ? 'bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-950 dark:border-green-800 dark:hover:bg-green-900'
                            : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-950 dark:border-yellow-800 dark:hover:bg-yellow-900'
                        }`}
                        onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                      >
                        <div className='flex items-start justify-between gap-3'>
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-center gap-2 mb-1'>
                              <h4
                                className={`font-medium text-sm ${
                                  notification.isRead ? 'text-muted-foreground' : 'text-foreground'
                                }`}
                              >
                                {notification.title}
                              </h4>
                            </div>
                            <p className='text-sm text-muted-foreground mb-2 line-clamp-2'>
                              {notification.content}
                            </p>
                            <span className='text-xs text-muted-foreground'>
                              {notification.createdAt
                                ? new Date(notification.createdAt).toLocaleString('ru-RU')
                                : 'Недавно'
                              }
                            </span>
                          </div>
                        <div className='flex items-center gap-1'>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant='ghost'
                                size='sm'
                                className='h-8 w-8 p-0'
                                onClick={e => e.stopPropagation()}
                              >
                                <MoreHorizontal className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              {!notification.isRead && (
                                <DropdownMenuItem
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notification.id);
                                  }}
                                >
                                  <Eye className='mr-2 h-4 w-4' />
                                  Отметить как прочитанное
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={e => {
                                  e.stopPropagation();
                                  archiveNotification(notification.id);
                                }}
                              >
                                <Archive className='mr-2 h-4 w-4' />
                                Архивировать
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={e => {
                                  e.stopPropagation();
                                  handleDeleteNotification(notification.id);
                                }}
                                className='text-red-600 focus:text-red-600'
                              >
                                <Trash2 className='mr-2 h-4 w-4' />
                                Удалить
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
