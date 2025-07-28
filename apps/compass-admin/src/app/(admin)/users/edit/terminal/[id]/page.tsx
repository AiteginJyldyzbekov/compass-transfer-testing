import { TerminalEditView } from '@pages/(admin)/users/edit/terminal-edit-view';

interface EditTerminalPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTerminalPage({ params }: EditTerminalPageProps) {
  const { id } = await params;

  return <TerminalEditView userId={id} />;
}
