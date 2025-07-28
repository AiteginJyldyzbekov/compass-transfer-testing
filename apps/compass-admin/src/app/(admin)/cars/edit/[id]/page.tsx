'use client';

import { CarEditView } from '@pages/(admin)/cars/edit/car-edit-view';

interface EditCarPageProps {
  params: {
    id: string;
  };
}

export default function EditCarPage({ params }: EditCarPageProps) {
  return <CarEditView carId={params.id} />;
}
