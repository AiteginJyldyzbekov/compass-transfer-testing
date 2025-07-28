'use client';

import { useRouter } from 'next/navigation';
import { useCustomerFormLogic } from '@features/users/forms/create/customer-form';
import { CustomerFormView } from '@pages/(admin)/users/create/customer-form-view';

export default function CreateCustomerPage() {
  const router = useRouter();

  const logic = useCustomerFormLogic({
    selectedRole: 'Customer',
    onBack: () => router.push('/users'),
    onSuccess: () => router.push('/users'),
  });

  return <CustomerFormView {...logic} />;
}
