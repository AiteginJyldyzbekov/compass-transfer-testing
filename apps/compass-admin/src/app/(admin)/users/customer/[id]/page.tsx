import { ProfileView } from '@pages/(admin)/users/view/profile-view';

interface CustomerPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerPage({ params }: CustomerPageProps) {
  const { id } = await params;

  return <ProfileView userId={id} userRole="Customer" />;
}

export async function generateMetadata({ params }: CustomerPageProps) {
  const { id } = await params;

  return {
    title: `Клиент ${id} | Compass Admin`,
    description: 'Просмотр информации о клиенте',
  };
}
