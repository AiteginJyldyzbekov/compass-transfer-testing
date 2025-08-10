import { ScheduledOrderPage } from '@pages/(admin)/orders/create/scheduled/scheduled-order-page';

interface EditScheduledOrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditScheduledOrderPage({ params }: EditScheduledOrderPageProps) {
  const { id } = await params;
  
  return <ScheduledOrderPage mode="edit" id={id} />;
}

export async function generateMetadata({ params }: EditScheduledOrderPageProps) {
  const { id } = await params;
  
  return {
    title: `Редактировать запланированный заказ ${id} | Compass Admin`,
    description: 'Редактирование запланированного заказа',
  };
}
