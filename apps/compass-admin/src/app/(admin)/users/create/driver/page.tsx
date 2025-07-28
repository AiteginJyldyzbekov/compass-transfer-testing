'use client';

import { useRouter } from 'next/navigation';
import { useDriverFormLogic } from '@features/users/forms/create/driver-form';
import { DriverFormView } from '@pages/(admin)/users/create/driver-form-view';

export default function CreateDriverPage() {
  const router = useRouter();

  const logic = useDriverFormLogic({
    selectedRole: 'Driver',
    onBack: () => router.push('/users'),
    onSuccess: () => router.push('/users'),
  });

  return <DriverFormView {...logic} />;
}
