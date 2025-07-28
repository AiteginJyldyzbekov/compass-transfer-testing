import { PartnerEditView } from '@pages/(admin)/users/edit/partner-edit-view';

interface EditPartnerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPartnerPage({ params }: EditPartnerPageProps) {
  const { id } = await params;

  return <PartnerEditView userId={id} />;
}
