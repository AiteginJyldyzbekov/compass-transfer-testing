'use client';

import { TariffEditView } from '@pages/(admin)/tariffs/edit/tariff-edit-view';

interface EditTariffPageProps {
  params: {
    id: string;
  };
}

export default function EditTariffPage({ params }: EditTariffPageProps) {
  return <TariffEditView tariffId={params.id} />;
}
