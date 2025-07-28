'use client';

import { useRouter } from 'next/navigation';
import { NotificationFormView } from '@pages/(admin)/notifications/create/notification-form-view';
import { useNotificationFormLogic } from '@features/notifications/forms/create/notification-form';

export default function CreateNotificationPage() {
  const router = useRouter();

  const logic = useNotificationFormLogic({
    onBack: () => router.push('/notifications'),
    onSuccess: () => router.push('/notifications'),
  });

  return <NotificationFormView {...logic} />;
}
