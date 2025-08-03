import { UsersTable } from '@features/users';
import { CreateUserButton } from './create-user-button';

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

          <CreateUserButton />
        </div>

        <UsersTable initialRoleFilter={params.role} />
      </div>
    </div>
  );
}
