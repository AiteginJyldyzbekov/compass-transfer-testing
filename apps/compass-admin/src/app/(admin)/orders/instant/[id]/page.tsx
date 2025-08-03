import { InstantOrderViewPage } from '@pages/(admin)/orders/view/instant';
import type { Metadata } from 'next';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: `Мгновенный заказ #${params.id}`,
    description: 'Просмотр мгновенного заказа',
  };
}

export default function InstantOrderPage({ params }: PageProps) {
  return <InstantOrderViewPage orderId={params.id} />;
}