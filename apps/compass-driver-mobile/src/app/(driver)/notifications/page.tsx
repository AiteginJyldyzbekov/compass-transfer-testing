'use client';

import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { AlertCircle, Bell, Clock, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import type { GetNotificationDTO } from '@shared/api/notifications';
import { useNotificationActions } from '@features/notifications/hooks/use-notification-actions';
import { useNotifications, NotificationCategory } from '@features/notifications/hooks/useNotifications';
import { OrderIcon, NotificationInfoIcon, WarningIcon } from '@shared/icons';

// Конфигурация табов
const TAB_CONFIG = {
  [NotificationCategory.ORDER]: {
    label: 'О заказе',
    icon: OrderIcon,
    bgColor: 'bg-[#FFC4000D]',
    iconBg: 'bg-[#FFC400]',
    iconColor: 'text-orange-600',
  },
  [NotificationCategory.IMPORTANT]: {
    label: 'Важная информация',
    icon: NotificationInfoIcon,
    bgColor: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  [NotificationCategory.WARNING]: {
    label: 'Предупреждения',
    icon: WarningIcon,
    bgColor: 'bg-red-50',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
  },
};

export default function NotificationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<NotificationCategory>(NotificationCategory.ORDER);
  const { notifications, isLoading, error, unreadCategoryCounts, actions } = useNotifications();
  const { isUpdating } = useNotificationActions({
    onSuccess: () => {
      actions.refresh(activeTab);
    },
  });

  // Загружаем уведомления при монтировании компонента или смене таба
  useEffect(() => {
    actions.loadNotifications(false, activeTab);
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNotificationClick = (notification: GetNotificationDTO) => {
    // Переходим к детальной странице уведомления
    router.push(`/notifications/${notification.id}`);
  };

  const handleTabChange = (tab: NotificationCategory) => {
    setActiveTab(tab);
  };

  if (isLoading) {
    return (
      <div className='min-h-full bg-gray-50 p-4'>
        <div className='max-w-md mx-auto'>
          <div className='mb-6'>
            <h1 className='text-2xl font-bold text-gray-900'>Уведомления</h1>
          </div>
          <div className='bg-white rounded-2xl p-8 text-center shadow-sm'>
            <div className='w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4' />
            <p className='text-gray-500'>Загрузка уведомлений...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-full bg-gray-50 p-4'>
        <div className='max-w-md mx-auto'>
          <div className='mb-6'>
            <h1 className='text-2xl font-bold text-gray-900'>Уведомления</h1>
          </div>
          <div className='bg-white rounded-2xl p-8 text-center shadow-sm'>
            <AlertCircle className='w-16 h-16 text-red-300 mx-auto mb-4' />
            <h2 className='text-lg font-semibold text-gray-900 mb-2'>
              Ошибка загрузки
            </h2>
            <p className='text-gray-500 mb-4'>{error}</p>
            <button
              onClick={() => actions.refresh(activeTab)}
              className='px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors'
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentTabConfig = TAB_CONFIG[activeTab];

  return (
    <div className='min-h-full bg-gray-50'>
      <div className='max-w-md mx-auto'>
        {/* Табы - фиксированные сверху */}
        <div className='sticky top-0 bg-gray-50 z-10 pt-4 pb-4'>
          <div className='overflow-x-auto overflow-y-hidden scrollbar-hide'>
            <div className='flex px-4' style={{ width: 'max-content' }}>
              {/* Табы категорий */}
              {Object.entries(TAB_CONFIG).map(([category, config]) => {
                const categoryKey = category as NotificationCategory;
                const unreadCount = unreadCategoryCounts[categoryKey] || 0;
                const IconComponent = config.icon;

                return (
                  <button
                    key={category}
                    onClick={() => handleTabChange(categoryKey)}
                    className={`flex items-center justify-center px-6 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap relative ${config.iconColor
                      } ${activeTab === categoryKey
                        ? 'opacity-100'
                        : 'opacity-70 hover:opacity-90'
                      }`}
                  >
                    <IconComponent className='w-4 h-4 mr-2 flex-shrink-0' />
                    <span className='font-semibold'>{config.label}</span>
                    {unreadCount > 0 && (
                      <span className={`ml-2 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[20px] text-center flex-shrink-0 ${categoryKey === NotificationCategory.ORDER
                        ? 'bg-orange-500'
                        : categoryKey === NotificationCategory.IMPORTANT
                          ? 'bg-blue-500'
                          : 'bg-red-500'
                        }`}>
                        {unreadCount}
                      </span>
                    )}
                    {/* Активный индикатор */}
                    {activeTab === categoryKey && (
                      <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-full ${categoryKey === NotificationCategory.ORDER
                        ? 'bg-orange-500'
                        : categoryKey === NotificationCategory.IMPORTANT
                          ? 'bg-blue-500'
                          : 'bg-red-500'
                        }`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Список уведомлений */}
        <div className='px-4 pb-4'>
          {notifications.length === 0 ? (
            <div className='bg-white rounded-2xl p-8 text-center shadow-sm'>
              <Bell className='w-16 h-16 text-gray-300 mx-auto mb-4' />
              <h2 className='text-lg font-semibold text-gray-900 mb-2'>
                Нет уведомлений
              </h2>
              <p className='text-gray-500'>
                Важные сообщения и оповещения будут отображаться здесь
              </p>
            </div>
          ) : (
            <div className='space-y-1'>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${currentTabConfig.bgColor} rounded-2xl p-4 transition-all duration-200 cursor-pointer hover:shadow-sm relative`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className='flex items-center space-x-3'>
                    {/* Иконка */}
                    <div className={`p-2 rounded-full flex-shrink-0`}>
                      {(() => {
                        const IconComponent = currentTabConfig.icon;
                        return <IconComponent className={`w-[40px] h-[40px] ${currentTabConfig.iconColor}`} />;
                      })()}
                    </div>
                    {!notification.isRead && (
                      <div className='absolute top-[15px] left-0 w-2 h-2 bg-[#FFC400] rounded-full' />
                    )}

                    {/* Контент */}
                    <div className='flex-1 min-w-0'>
                      <h3 className='text-sm font-semibold text-gray-900 mb-1'>
                        {notification.title}
                      </h3>

                      {notification.content && (
                        <p className='text-sm text-gray-600 mb-1'>
                          {notification.content}
                        </p>
                      )}

                      <div className='flex items-center text-xs text-gray-400'>
                        <Clock className='w-3 h-3 mr-1' />
                        {notification.createdAt && formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: ru,
                        })}
                      </div>
                    </div>

                    {/* Стрелка и индикатор непрочитанного */}
                    <div className='flex items-center space-x-2 flex-shrink-0'>
                      <ChevronRight className='w-5 h-5 text-gray-400' />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Кнопка "Загрузить еще" если есть еще уведомления */}
          {notifications.length > 0 && (
            <div className='mt-6 text-center'>
              <button
                onClick={() => actions.refresh(activeTab)}
                disabled={isUpdating}
                className='px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50'
              >
                {isUpdating ? 'Обновление...' : 'Обновить'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}