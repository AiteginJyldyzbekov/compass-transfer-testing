'use client';

import { useRouter } from 'next/navigation';
import { useTerminalFormLogic } from '@features/users/forms/create/terminal-form';
import { TerminalFormView } from '@pages/(admin)/users/create/terminal-form-view';

export default function CreateTerminalPage() {
  const router = useRouter();

  const logic = useTerminalFormLogic({
    selectedRole: 'Terminal',
    onBack: () => router.push('/users'),
    onSuccess: () => router.push('/users'),
  });

  return <TerminalFormView {...logic} />;
}
