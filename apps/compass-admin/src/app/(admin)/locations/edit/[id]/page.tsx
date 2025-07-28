'use client';

import { LocationEditView } from '@pages/(admin)/locations/edit/location-edit-view';

interface EditLocationPageProps {
  params: {
    id: string;
  };
}

export default function EditLocationPage({ params }: EditLocationPageProps) {
  return <LocationEditView locationId={params.id} />;
}
