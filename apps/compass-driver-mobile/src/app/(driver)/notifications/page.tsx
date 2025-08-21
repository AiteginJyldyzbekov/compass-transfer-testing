'use client';

import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { AlertCircle, Bell, Clock, CheckCircle, Car, Info, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import type { GetNotificationDTO } from '@shared/api/notifications';
import { useNotificationActions } from '@features/notifications/hooks/use-notification-actions';
import { useNotifications, NotificationCategory } from '@features/notifications/hooks/useNotifications';

// Конфигурация табов
const TAB_CONFIG = {
  [NotificationCategory.ORDER]: {
    label: 'О заказе',
    icon: Car,
  },
  [NotificationCategory.IMPORTANT]: {
    label: 'Важная информация', 
    icon: Info,
  },
  [NotificationCategory.WARNING]: {
    label: 'Предупреждения',
    icon: AlertTriangle,
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

  return (
    <div className='min-h-full bg-gray-50 p-4'>
      <div className='max-w-md mx-auto'>
        {/* Заголовок */}
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-gray-900'>Уведомления</h1>
        </div>

        {/* Табы */}
        <div className='mb-6'>
          <div className='overflow-x-auto overflow-y-hidden'>
            <div className='flex space-x-2 bg-gray-100 p-1 rounded-xl w-max'>
              {/* Табы категорий */}
              {Object.entries(TAB_CONFIG).map(([category, config]) => {
                const categoryKey = category as NotificationCategory;
                const unreadCount = unreadCategoryCounts[categoryKey] || 0;
                const IconComponent = config.icon;
                
                return (
                  <button
                    key={category}
                    onClick={() => handleTabChange(categoryKey)}
                    className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap min-w-fit ${
                      activeTab === categoryKey
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <IconComponent className='w-4 h-4 mr-1 flex-shrink-0' />
                    <span>{config.label}</span>
                    {unreadCount > 0 && (
                      <span className='ml-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center flex-shrink-0'>
                        {unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Список уведомлений */}
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
          <div className='space-y-3'>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl p-4 shadow-sm transition-all duration-200 cursor-pointer ${
                  !notification.isRead 
                    ? 'border-l-4 border-blue-500 bg-blue-50/30' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className='flex items-start space-x-3'>
                  <div className={`p-2 rounded-full ${
                    !notification.isRead ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {!notification.isRead ? (
                      <Bell className='w-5 h-5 text-blue-600' />
                    ) : (
                      <CheckCircle className='w-5 h-5 text-gray-500' />
                    )}
                  </div>
                  
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between mb-1'>
                      <h3 className={`text-sm font-semibold ${
                        !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <div className='w-2 h-2 bg-blue-500 rounded-full flex-shrink-0' />
                      )}
                    </div>
                    
                    {notification.content && (
                      <p className={`text-sm ${
                        !notification.isRead ? 'text-gray-700' : 'text-gray-500'
                      } mb-2`}>
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
  );
}
