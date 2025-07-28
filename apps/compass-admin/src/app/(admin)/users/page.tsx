import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@shared/ui/forms/button';
import { UsersTable } from '@features/users';

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className='flex flex-col border rounded-2xl h-full overflow-hidden pr-2 bg-white'>
      <div className='flex flex-col overflow-y-auto pl-4 pr-2 py-4'>
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-col'>
            <h1 className='text-3xl font-bold tracking-tight'>Пользователи</h1>
            <p className='text-muted-foreground'>Управление пользователями системы</p>
          </div>

          <Button
            asChild
            className='w-full md:w-auto focus-visible:ring-0 focus:ring-0 focus-visible:ring-offset-0 hover:shadow-md focus:shadow-md focus-visible:shadow-md transition-shadow'
          >
            <Link href='/users/create'>
              <Plus className='mr-2 h-4 w-4' />
              Создать пользователя
            </Link>
          </Button>
        </div>

        <UsersTable initialRoleFilter={params.role} />
      </div>
    </div>
  );
}
