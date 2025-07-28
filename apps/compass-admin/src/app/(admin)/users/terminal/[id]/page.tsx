import { ProfileView } from '@pages/(admin)/users/view/profile-view';

interface TerminalPageProps {
  params: Promise<{ id: string }>;
}

export default async function TerminalPage({ params }: TerminalPageProps) {
  const { id } = await params;

  return <ProfileView userId={id} userRole="Terminal" />;
}

export async function generateMetadata({ params }: TerminalPageProps) {
  const { id } = await params;

  return {
    title: `Терминал ${id} | Compass Admin`,
    description: 'Просмотр информации о терминале',
  };
}
