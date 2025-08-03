import { notFound } from 'next/navigation';
import { CarView } from '@pages/(admin)/cars/view';

interface CarViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CarViewPage({ params }: CarViewPageProps) {
  const { id: carId } = await params;

  if (!carId) {
    notFound();
  }

  return <CarView carId={carId} />;
}

export const metadata = {
  title: 'Просмотр автомобиля | Compass Admin',
  description: 'Просмотр информации об автомобиле',
};