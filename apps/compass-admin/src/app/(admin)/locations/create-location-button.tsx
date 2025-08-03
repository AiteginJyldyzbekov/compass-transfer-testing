'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@shared/ui/forms/button';
import { useUserRole } from '@shared/contexts';
import { Role } from '@entities/users/enums';

export function CreateLocationButton() {
  const { userRole } = useUserRole();
  
  // Проверяем, может ли пользователь создавать локации (все роли кроме Operator)
  const canCreateLocations = userRole !== Role.Operator;

  if (!canCreateLocations) {
    return null;
  }

  return (
    <Button
      asChild
      className='w-full md:w-auto focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow'
    >
      <Link href='/locations/create'>
        <Plus className='mr-2 h-4 w-4' />
        Добавить локацию
      </Link>
    </Button>
  );
}
