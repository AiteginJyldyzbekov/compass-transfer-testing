'use client';

import { useRouter } from 'next/navigation';
import { LocationFormView } from '@pages/(admin)/locations/create/location-form-view';
import { useLocationFormLogic } from '@features/locations/forms/create/location-form';

export default function CreateLocationPage() {
  const router = useRouter();

  const logic = useLocationFormLogic({
    onBack: () => router.push('/locations'),
    onSuccess: () => router.push('/locations'),
  });

  return <LocationFormView {...logic} />;
}
