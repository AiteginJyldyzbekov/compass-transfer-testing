import { notFound } from 'next/navigation';
import { TariffView } from '@pages/(admin)/tariffs/view';

interface TariffViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TariffViewPage({ params }: TariffViewPageProps) {
  const { id: tariffId } = await params;

  if (!tariffId) {
    notFound();
  }

  return <TariffView tariffId={tariffId} />;
}

export const metadata = {
  title: 'Просмотр тарифа | Compass Admin',
  description: 'Просмотр информации о тарифе',
};