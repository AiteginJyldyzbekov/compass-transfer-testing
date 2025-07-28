'use client';

import { useRouter } from 'next/navigation';
import { useAdminFormLogic } from '@features/users/forms/create/admin-form';
import { AdminFormView } from '@pages/(admin)/users/create/admin-form-view';

export default function CreateAdminPage() {
  const router = useRouter();

  const logic = useAdminFormLogic({
    selectedRole: 'Admin',
    onBack: () => router.push('/users'),
    onSuccess: () => router.push('/users'),
  });

  return <AdminFormView {...logic} />;
}
