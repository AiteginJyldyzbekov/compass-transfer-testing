'use client';

import { Car, User, Users, FileText, MapPin, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/ui/layout/card';

interface Role {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description: string;
}

interface RoleSelectionProps {
  onRoleSelect: (roleId: string) => void;
}

const userRoles: Role[] = [
  {
    id: 'Admin',
    label: 'Администратор',
    icon: Shield,
    color: 'bg-indigo-500',
    description: 'Управляет системой и пользователями',
  },
  {
    id: 'Customer',
    label: 'Клиент',
    icon: User,
    color: 'bg-blue-500',
    description: 'Заказывает поездки и использует сервис',
  },
  {
    id: 'Driver',
    label: 'Водитель',
    icon: Car,
    color: 'bg-green-500',
    description: 'Управляет автомобилем и выполняет заказы',
  },
  {
    id: 'Operator',
    label: 'Оператор',
    icon: Users,
    color: 'bg-purple-500',
    description: 'Обрабатывает заказы и поддерживает клиентов',
  },
  {
    id: 'Partner',
    label: 'Контр-агент',
    icon: FileText,
    color: 'bg-orange-500',
    description: 'Предоставляет услуги и сотрудничает с сервисом',
  },
  {
    id: 'Terminal',
    label: 'Терминал',
    icon: MapPin,
    color: 'bg-red-500',
    description: 'Автоматизированная система для заказов',
  },
];

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  return (
    <Card className='flex flex-col gap-4'>
      <CardHeader className='text-center'>
        <CardTitle className='text-2xl'>Выберите роль пользователя</CardTitle>
        <p className='text-muted-foreground'>Выберите тип пользователя, которого хотите создать</p>
      </CardHeader>
      <CardContent className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {userRoles.map(role => {
          const Icon = role.icon;

          return (
            <button
              key={role.id}
              type='button'
              onClick={() => onRoleSelect(role.id)}
              className='w-full p-6 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-all group'
            >
              <div className='flex flex-col items-center text-center gap-4'>
                <div
                  className={`w-16 h-16 ${role.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}
                >
                  <Icon className='h-8 w-8' />
                </div>
                <div>
                  <h3 className='font-semibold text-lg'>{role.label}</h3>
                  <p className='text-sm text-muted-foreground mt-2'>{role.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
