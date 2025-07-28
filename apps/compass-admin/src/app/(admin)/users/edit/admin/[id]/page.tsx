import { AdminEditView } from '@pages/(admin)/users/edit/admin-edit-view';

interface EditAdminPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAdminPage({ params }: EditAdminPageProps) {
  const { id } = await params;

  return <AdminEditView userId={id} />;
}
