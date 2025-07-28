import { DriverEditView } from '@pages/(admin)/users/edit/driver-edit-view';

interface EditDriverPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditDriverPage({ params }: EditDriverPageProps) {
  const { id } = await params;

  return <DriverEditView userId={id} />;
}
