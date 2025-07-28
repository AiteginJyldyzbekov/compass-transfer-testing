'use client';

import { useRouter } from 'next/navigation';
import { CarFormView } from '@pages/(admin)/cars/create/car-form-view';
import { useCarFormLogic } from '@features/cars/forms/create/car-form';

export default function CreateCarPage() {
  const router = useRouter();

  const logic = useCarFormLogic({
    onBack: () => router.push('/cars'),
    onSuccess: () => router.push('/cars'),
  });

  return <CarFormView {...logic} />;
}
