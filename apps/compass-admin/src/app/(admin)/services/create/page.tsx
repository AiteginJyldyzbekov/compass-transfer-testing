'use client';

import { useRouter } from 'next/navigation';
import { ServiceFormView } from '@pages/(admin)/services/create/service-form-view';
import { useServiceFormLogic } from '@features/services/forms/create/service-form';

export default function CreateServicePage() {
  const router = useRouter();

  const logic = useServiceFormLogic({
    onBack: () => router.push('/services'),
    onSuccess: () => router.push('/services'),
  });

  return <ServiceFormView {...logic} />;
}
