import { ProfileView } from '@pages/(admin)/users/view/profile-view';

interface AdminPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { id } = await params;

  return <ProfileView userId={id} userRole="Admin" />;
}

export async function generateMetadata({ params }: AdminPageProps) {
  const { id } = await params;

  return {
    title: `Администратор ${id} | Compass Admin`,
    description: 'Просмотр информации об администраторе',
  };
}
