'use client';

import { ServiceEditView } from '@pages/(admin)/services/edit/service-edit-view';

interface EditServicePageProps {
  params: {
    id: string;
  };
}

export default function EditServicePage({ params }: EditServicePageProps) {
  return <ServiceEditView serviceId={params.id} />;
}
