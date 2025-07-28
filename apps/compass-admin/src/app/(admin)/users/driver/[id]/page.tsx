import { ProfileView } from '@pages/(admin)/users/view/profile-view';

interface DriverPageProps {
  params: Promise<{ id: string }>;
}

export default async function DriverPage({ params }: DriverPageProps) {
  const { id } = await params;

  return <ProfileView userId={id} userRole="Driver" />;
}

export async function generateMetadata({ params }: DriverPageProps) {
  const { id } = await params;

  return {
    title: `Водитель ${id} | Compass Admin`,
    description: 'Просмотр информации о водителе',
  };
}
