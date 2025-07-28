'use client';

import { NotificationEditView } from '@pages/(admin)/notifications/edit/notification-edit-view';

interface EditNotificationPageProps {
  params: {
    id: string;
  };
}

export default function EditNotificationPage({ params }: EditNotificationPageProps) {
  return <NotificationEditView notificationId={params.id} />;
}
