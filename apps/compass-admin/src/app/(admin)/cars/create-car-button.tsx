'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@shared/ui/forms/button';
import { useUserRole } from '@shared/contexts';
import { Role } from '@entities/users/enums';

export function CreateCarButton() {
  const { userRole } = useUserRole();
  
  // Проверяем, может ли пользователь создавать автомобили (все роли кроме Operator)
  const canCreateCars = userRole !== Role.Operator;

  if (!canCreateCars) {
    return null;
  }

  return (
    <Button
      asChild
      className='w-full md:w-auto focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow'
    >
      <Link href='/cars/create'>
        <Plus className='mr-2 h-4 w-4' />
        Добавить автомобиль
      </Link>
    </Button>
  );
}
