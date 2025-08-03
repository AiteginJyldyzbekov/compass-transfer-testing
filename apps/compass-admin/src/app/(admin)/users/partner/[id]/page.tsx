import { ProfileView } from '@pages/(admin)/users/view/profile-view';

interface PartnerPageProps {
  params: Promise<{ id: string }>;
}

export default async function PartnerPage({ params }: PartnerPageProps) {
  const { id } = await params;

  return <ProfileView userId={id} userRole="Partner" />;
}

export async function generateMetadata({ params }: PartnerPageProps) {
  const { id } = await params;

  return {
    title: `Контр-агент ${id} | Compass Admin`,
    description: 'Просмотр информации о Контр-агент',
  };
}
