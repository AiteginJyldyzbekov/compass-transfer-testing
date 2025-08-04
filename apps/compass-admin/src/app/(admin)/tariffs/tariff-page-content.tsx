'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useUserRole } from '@shared/contexts/user-role-context';
import { Role } from '@entities/users/enums';
import { TariffsTable } from '@features/tariffs';
import { TariffCardsView } from '@pages/(partner)/tariffs';
import { CreateTariffButton } from './create-tariff-button';
import { TariffViewToggle } from './tariff-view-toggle';

export function TariffPageContent() {
  const searchParams = useSearchParams();
  const { userRole } = useUserRole();

  // Получаем параметры из URL (только для фильтров)
  const params = {
    name: searchParams.get('name') || undefined,
    serviceClass: searchParams.get('serviceClass') || undefined,
    carType: searchParams.get('carType') || undefined,
    archived: searchParams.get('archived') || undefined,
  };

  // Определяем вид по умолчанию
  const getDefaultView = (): 'table' | 'cards' => {
    if (userRole === Role.Partner) return 'cards';

    // Для админов и операторов проверяем localStorage
    if (typeof window !== 'undefined') {
      const savedView = localStorage.getItem('tariffs-view-preference') as 'table' | 'cards' | null;

      if (savedView) return savedView;
    }

    return 'table';
  };

  // Состояние для текущего вида (только из localStorage)
  const [currentView, setCurrentView] = useState<'table' | 'cards'>(() => {
    return getDefaultView();
  });

  // Обновляем вид при изменении роли
  useEffect(() => {
    const getView = (): 'table' | 'cards' => {
      if (userRole === Role.Partner) return 'cards';

      // Для админов и операторов проверяем localStorage
      if (typeof window !== 'undefined') {
        const savedView = localStorage.getItem('tariffs-view-preference') as 'table' | 'cards' | null;
        
        if (savedView) return savedView;
      }

      return 'table';
    };

    const newView = getView();

    setCurrentView(newView);
  }, [userRole]);

  // Функция для изменения вида
  const handleViewChange = (view: 'table' | 'cards') => {
    setCurrentView(view);

    // Сохраняем предпочтение в localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('tariffs-view-preference', view);
    }
  };

  // Для партнеров всегда показываем карточки
  if (userRole === Role.Partner) {
    return (
      <div className='flex flex-col border rounded-2xl h-full overflow-hidden pr-2 bg-white'>
        <div className='flex flex-col overflow-y-auto pl-4 pr-2 py-4'>
          <div className='flex flex-col gap-2 mb-6'>
            <div className='flex flex-col'>
              <h1 className='text-3xl font-bold tracking-tight'>Тарифы</h1>
              <p className='text-muted-foreground'>Выберите подходящий тариф для вашей поездки</p>
            </div>
          </div>

          <TariffCardsView />
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col border rounded-2xl h-full overflow-hidden pr-2 bg-white'>
      <div className='flex flex-col overflow-y-auto pl-4 pr-2 py-4'>
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-col'>
            <h1 className='text-3xl font-bold tracking-tight'>Тарифы</h1>
            <p className='text-muted-foreground'>
              {currentView === 'cards' 
                ? 'Выберите подходящий тариф для вашей поездки' 
                : 'Управление тарифами системы'
              }
            </p>
          </div>

          <div className='flex items-center gap-2'>
            {/* Переключатель вида для админов */}
            {(userRole === Role.Admin || userRole === Role.Operator) && (
              <TariffViewToggle
                defaultView={currentView}
                onViewChange={handleViewChange}
              />
            )}

            {/* Кнопка создания только для админов в табличном виде */}
            {userRole === Role.Admin && currentView === 'table' && (
              <CreateTariffButton />
            )}
          </div>
        </div>

        {/* Контент в зависимости от выбранного вида */}
        {currentView === 'cards' ? (
          <TariffCardsView />
        ) : (
          <TariffsTable initialFilters={params} />
        )}
      </div>
    </div>
  );
}
