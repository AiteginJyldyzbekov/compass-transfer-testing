'use client';

import { useRouter } from 'next/navigation';

export default function CreateUserPage() {
  const router = useRouter();

  const handleRoleSelect = (roleId: string) => {
    router.push(`/users`);
  };

  return (
    <div className='flex flex-col gap-6 h-full'>
    </div>
  );
}
