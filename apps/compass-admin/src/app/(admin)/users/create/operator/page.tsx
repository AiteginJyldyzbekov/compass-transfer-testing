'use client';

import { useRouter } from 'next/navigation';
import { useOperatorFormLogic } from '@features/users/forms/create/operator-form';
import { OperatorFormView } from '@pages/(admin)/users/create/operator-form-view';

export default function CreateOperatorPage() {
  const router = useRouter();

  const logic = useOperatorFormLogic({
    selectedRole: 'Operator',
    onBack: () => router.push('/users'),
    onSuccess: () => router.push('/users'),
  });

  return <OperatorFormView {...logic} />;
}
