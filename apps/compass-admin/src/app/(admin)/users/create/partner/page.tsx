'use client';

import { useRouter } from 'next/navigation';
import { usePartnerFormLogic } from '@features/users/forms/create/partner-form';
import { PartnerFormView } from '@pages/(admin)/users/create/partner-form-view';

export default function CreatePartnerPage() {
  const router = useRouter();

  const logic = usePartnerFormLogic({
    selectedRole: 'Partner',
    onBack: () => router.push('/users'),
    onSuccess: () => router.push('/users'),
  });

  return <PartnerFormView {...logic} />;
}
