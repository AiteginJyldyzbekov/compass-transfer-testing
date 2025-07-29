'use client';

import { use } from 'react';
import { CarEditView } from '@pages/(admin)/cars/edit/car-edit-view';

interface EditCarPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditCarPage({ params }: EditCarPageProps) {
  const { id } = use(params);
  return <CarEditView carId={id} />;
}
