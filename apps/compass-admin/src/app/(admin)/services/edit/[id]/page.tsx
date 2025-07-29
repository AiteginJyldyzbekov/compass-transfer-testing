'use client';

import { use } from 'react';
import { ServiceEditView } from '@pages/(admin)/services/edit/service-edit-view';

interface EditServicePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditServicePage({ params }: EditServicePageProps) {
  const { id } = use(params);
  return <ServiceEditView serviceId={id} />;
}
