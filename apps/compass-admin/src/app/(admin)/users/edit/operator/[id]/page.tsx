import { OperatorEditView } from '@pages/(admin)/users/edit/operator-edit-view';

interface EditOperatorPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditOperatorPage({ params }: EditOperatorPageProps) {
  const { id } = await params;

  return <OperatorEditView userId={id} />;
}
