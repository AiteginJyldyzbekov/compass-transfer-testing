import { ScheduledOrderViewPage } from '@pages/(admin)/orders/view/scheduled';
import type { Metadata } from 'next';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Запланированный заказ #${params.id}`,
    description: 'Просмотр запланированного заказа',
  };
}

export default function ScheduledOrderPage({ params }: PageProps) {
  return <ScheduledOrderViewPage orderId={params.id} />;
}