'use client';

import { use } from 'react';
import { LocationEditView } from '@pages/(admin)/locations/edit/location-edit-view';

interface EditLocationPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditLocationPage({ params }: EditLocationPageProps) {
  const { id } = use(params);
  return <LocationEditView locationId={id} />;
}
