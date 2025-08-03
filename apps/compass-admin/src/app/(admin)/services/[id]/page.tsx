import { notFound } from 'next/navigation';
import { ServiceView } from '@pages/(admin)/services/view';

interface ServiceViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ServiceViewPage({ params }: ServiceViewPageProps) {
  const { id: serviceId } = await params;

  if (!serviceId) {
    notFound();
  }

  return <ServiceView serviceId={serviceId} />;
}

export const metadata = {
  title: 'Просмотр услуги | Compass Admin',
  description: 'Просмотр информации об услуге',
};