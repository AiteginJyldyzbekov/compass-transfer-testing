import { CustomerEditView } from '@pages/(admin)/users/edit/customer-edit-view';

interface EditCustomerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const { id } = await params;

  return <CustomerEditView userId={id} />;
}
