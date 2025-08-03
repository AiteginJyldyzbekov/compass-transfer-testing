import { notFound } from 'next/navigation';
import { LocationView } from '@pages/(admin)/locations/view';

interface LocationViewPageProps {
  searchParams: Promise<{
    id?: string;
  }>;
}

export default async function LocationViewPage({ searchParams }: LocationViewPageProps) {
  const params = await searchParams;
  const locationId = params.id;

  if (!locationId) {
    notFound();
  }

  return <LocationView locationId={locationId} />;
}

export const metadata = {
  title: 'Просмотр локации | Compass Admin',
  description: 'Просмотр информации о локации',
};