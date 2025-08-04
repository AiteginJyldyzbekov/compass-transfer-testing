'use client';

import { useState, useEffect } from 'react';
import { CarsTable } from '@features/cars';
import { CarCardsView } from '@pages/(partner)/cars';
import { useUserRole } from '@shared/contexts/user-role-context';
import { Role } from '@entities/users/enums';
import { CreateCarButton } from './create-car-button';
import { CarViewToggle } from './car-view-toggle';

export function CarPageContent() {
  const { userRole } = useUserRole();
  
  // Определяем вид по умолчанию
  const getDefaultView = (): 'table' | 'cards' => {
    if (userRole === Role.Partner) return 'cards';
    
    // Для админов и операторов проверяем localStorage
    if (typeof window !== 'undefined') {
      const savedView = localStorage.getItem('cars-view-preference') as 'table' | 'cards' | null;
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
        const savedView = localStorage.getItem('cars-view-preference') as 'table' | 'cards' | null;
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
      localStorage.setItem('cars-view-preference', view);
    }
  };

  // Для партнеров всегда показываем карточки
  if (userRole === Role.Partner) {
    return (
      <div className='flex flex-col border rounded-2xl h-full overflow-hidden pr-2 bg-white'>
        <div className='flex flex-col overflow-y-auto pl-4 pr-2 py-4'>
          <div className='flex flex-col gap-2 mb-6'>
            <div className='flex flex-col'>
              <h1 className='text-3xl font-bold tracking-tight'>Автомобили</h1>
              <p className='text-muted-foreground'>Выберите подходящий автомобиль для вашей поездки</p>
            </div>
          </div>

          <CarCardsView />
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col border rounded-2xl h-full overflow-hidden pr-2 bg-white'>
      <div className='flex flex-col overflow-y-auto pl-4 pr-2 py-4'>
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-col'>
            <h1 className='text-3xl font-bold tracking-tight'>Автомобили</h1>
            <p className='text-muted-foreground'>Управление автопарком системы</p>
          </div>

          <div className='flex items-center gap-3'>
            {/* Переключатель вида только для админов и операторов */}
            {(userRole === Role.Admin || userRole === Role.Operator) && (
              <CarViewToggle
                defaultView={currentView}
                onViewChange={handleViewChange}
              />
            )}

            {/* Кнопка создания только для админов в табличном виде */}
            {userRole === Role.Admin && currentView === 'table' && (
              <CreateCarButton />
            )}
          </div>
        </div>

        {/* Контент в зависимости от выбранного вида */}
        {currentView === 'table' ? (
          <CarsTable />
        ) : (
          <CarCardsView />
        )}
      </div>
    </div>
  );
}
