import { ProfileView } from '@pages/(admin)/users/view/profile-view';

interface OperatorPageProps {
  params: Promise<{ id: string }>;
}

export default async function OperatorPage({ params }: OperatorPageProps) {
  const { id } = await params;

  return <ProfileView userId={id} userRole="Operator" />;
}

export async function generateMetadata({ params }: OperatorPageProps) {
  const { id } = await params;

  return {
    title: `Оператор ${id} | Compass Admin`,
    description: 'Просмотр информации об операторе',
  };
}
