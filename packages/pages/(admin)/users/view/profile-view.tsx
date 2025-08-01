'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { usersApi } from '@shared/api/users';
import {
  getRoleLabel,
  getPageTitle,
  BasicInfoSection,
  OperatorSection,
  UserOrdersSection,
  UserRidesSection,
  AdminSection,
  CustomerSection,
  DriverSection,
  PartnerSection,
  TerminalSection
} from '@entities/users';
import type { Role } from '@entities/users/enums';
import type { GetOperatorDTO, GetDriverDTO, GetCustomerDTO, GetAdminDTO, GetPartnerDTO, GetTerminalDTO } from '@entities/users/interface';
import {
  ProfileActions,
  ProfileError,
  ProfileHeader,
  ProfileLoading,
  ProfileTabs,
  type ProfileTab
} from '@features/users';

type UserData = GetOperatorDTO | GetDriverDTO | GetCustomerDTO | GetAdminDTO | GetPartnerDTO | GetTerminalDTO;

interface ProfileViewProps {
  userId: string;
  userRole: keyof typeof Role;
}

export function ProfileView({ userId, userRole }: ProfileViewProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>('basic');

  // Загрузка данных пользователя
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let userData: UserData;

        switch (userRole) {
          case 'Operator':
            userData = await usersApi.getOperator(userId);
            break;

          case 'Driver':
            userData = await usersApi.getDriver(userId);
            break;
          case 'Customer':
            userData = await usersApi.getCustomer(userId);
            break;
          case 'Admin':
            userData = await usersApi.getAdmin(userId);
            break;
          case 'Partner':
            userData = await usersApi.getPartner(userId);
            break;
          case 'Terminal':
            userData = await usersApi.getTerminal(userId);
            break;
          default:
            throw new Error('Неизвестная роль пользователя');
        }

        setUser(userData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : `Ошибка загрузки ${getRoleLabel(userRole)}`;

        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId, userRole]);

  // Функция для открытия карты
  const openMapSheet = (data: {
    address: string;
    latitude?: number;
    longitude?: number;
    title?: string;
  }) => {
    // Если есть валидные координаты, открываем Яндекс Карты с точными координатами
    if (data.latitude && data.longitude && data.latitude !== 0 && data.longitude !== 0) {
      const yandexMapsUrl = `https://yandex.ru/maps/10309/bishkek/?ll=${data.longitude},${data.latitude}&z=16`;

      window.open(yandexMapsUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Если координат нет, открываем поиск по адресу
      const searchQuery = encodeURIComponent(data.address);
      const yandexMapsSearchUrl = `https://yandex.ru/maps/10309/bishkek/?text=${searchQuery}`;

      window.open(yandexMapsSearchUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Функция для рендера роль-специфичной секции
  const renderRoleSpecificSection = () => {
    if (!user) return null;

    // Проверяем роль напрямую через userRole пропс
    switch (userRole) {
      case 'Driver':
        return <DriverSection profile={user} openMapSheet={openMapSheet} />;
      case 'Admin':
        return <AdminSection profile={user} />;
      case 'Operator':
        return <OperatorSection profile={user} />;
      case 'Partner':
        return <PartnerSection profile={user} openMapSheet={openMapSheet} />;
      case 'Terminal':
        return <TerminalSection profile={user} openMapSheet={openMapSheet} />;
      case 'Customer':
        return <CustomerSection profile={user} />;
      default:
        return null;
    }
  };

  // Обработчик кнопки "Назад"
  const handleBackToList = () => {
    window.location.href = '/users';
  };

  // Функция рендера контента табов
  const renderTabContent = () => {
    if (!user) return null;

    switch (activeTab) {
      case 'basic':
        return (
          <>
            <BasicInfoSection profile={user} />
            {renderRoleSpecificSection()}
          </>
        );
      case 'orders':
        return <UserOrdersSection userId={userId} />;
      case 'rides':
        return <UserRidesSection userId={userId} />;
      default:
        return null;
    }
  };

  // Состояние загрузки
  if (loading) {
    return <ProfileLoading />;
  }

  // Состояние ошибки
  if (error) {
    return <ProfileError error={error} onRetry={() => window.location.reload()} />;
  }

  // Если пользователь не найден
  if (!user) {
    return <ProfileError error={`${getRoleLabel(userRole)} не найден`} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className='pr-2 border rounded-2xl overflow-hidden shadow-sm h-full bg-white'>
      {/* Заголовок страницы */}
      <div className='overflow-y-auto h-full pl-4 pr-2'>
        <div className='flex items-center justify-between p-4'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>{getPageTitle(userRole)}</h1>
            <p className='text-muted-foreground'>Просмотр информации о {getRoleLabel(userRole)}</p>
          </div>
        </div>
        
        {/* Header на всю ширину */}
        <ProfileHeader profile={user} />

        {/* Двухколоночный layout */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Левая колонка - основная информация (3/4 ширины) */}
          <div className='lg:col-span-3 flex flex-col gap-6'>
            {/* Табы для переключения между секциями */}
            <div className='px-4'>
              <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} hideMy />
            </div>
            {/* Контент выбранной вкладки */}
            {renderTabContent()}
          </div>

          {/* Правая колонка - кнопки действий (1/4 ширины) */}
          <div className='lg:col-span-1'>
            <ProfileActions
              hidePasswordChange
              showBackButton
              onBack={handleBackToList}
              hideLogout
              targetUserId={userId}
              targetUserRole={userRole}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
