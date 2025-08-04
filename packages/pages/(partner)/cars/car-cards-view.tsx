'use client';

import { useState } from 'react';
import type { GetCarDTO } from '@entities/cars/interface';
import { useUserRole } from '@shared/contexts/user-role-context';
import { Role } from '@entities/users/enums';
import { CarCards } from './cards';

export function CarCardsView() {
  const { userRole } = useUserRole();
  const [selectedCar, setSelectedCar] = useState<GetCarDTO | null>(null);

  // Преобразуем роль в строку для CarCards
  const getRoleString = (): 'admin' | 'operator' | 'partner' | 'driver' | undefined => {
    switch (userRole) {
      case Role.Admin:
        return 'admin';
      case Role.Operator:
        return 'operator';
      case Role.Partner:
        return 'partner';
      case Role.Driver:
        return 'driver';
      default:
        return 'partner'; // По умолчанию партнер
    }
  };

  const handleCarClick = (car: GetCarDTO) => {
    // Для партнеров и водителей - логика выбора автомобиля
    setSelectedCar(car);
    console.log('Выбран автомобиль:', car);
    // Здесь можно добавить логику для выбора автомобиля (например, для заказа)
  };

  return (
    <div>
      {/* Готовый компонент карточек автомобилей */}
      <CarCards 
        onCarClick={handleCarClick} 
        userRole={getRoleString()}
      />
    </div>
  );
}
