'use client';

import { useRouter } from 'next/navigation';
import { TariffFormView } from '@pages/(admin)/tariffs/create/tariff-form-view';
import { useTariffFormLogic } from '@features/tariffs/forms/create/tariff-form';

export default function CreateTariffPage() {
  const router = useRouter();

  const logic = useTariffFormLogic({
    onBack: () => router.push('/tariffs'),
    onSuccess: () => router.push('/tariffs'),
  });

  return <TariffFormView {...logic} />;
}
