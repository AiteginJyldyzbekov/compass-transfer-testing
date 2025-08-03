'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@shared/ui/forms/button';
import { useUserRole } from '@shared/contexts';
import { Role } from '@entities/users/enums';

export function CreateServiceButton() {
  const { userRole } = useUserRole();
  
  // Проверяем, может ли пользователь создавать услуги (все роли кроме Operator)
  const canCreateServices = userRole !== Role.Operator;

  if (!canCreateServices) {
    return null;
  }

  return (
    <Button
      asChild
      className='w-full md:w-auto focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow'
    >
      <Link href='/services/create'>
        <Plus className='mr-2 h-4 w-4' />
        Добавить услугу
      </Link>
    </Button>
  );
}
