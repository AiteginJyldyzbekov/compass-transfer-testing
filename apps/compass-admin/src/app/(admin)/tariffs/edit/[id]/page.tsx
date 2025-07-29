'use client';

import { use } from 'react';
import { TariffEditView } from '@pages/(admin)/tariffs/edit/tariff-edit-view';

interface EditTariffPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditTariffPage({ params }: EditTariffPageProps) {
  const { id } = use(params);
  return <TariffEditView tariffId={id} />;
}
