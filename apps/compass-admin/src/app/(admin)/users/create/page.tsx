'use client';

import { useRouter } from 'next/navigation';
import { RoleSelection } from '@features/users';

export default function CreateUserPage() {
  const router = useRouter();

  const handleRoleSelect = (roleId: string) => {
    router.push(`/users/create/${roleId.toLowerCase()}`);
  };

  return (
    <div className='flex flex-col gap-6 h-full'>
      <RoleSelection onRoleSelect={handleRoleSelect} />
    </div>
  );
}
