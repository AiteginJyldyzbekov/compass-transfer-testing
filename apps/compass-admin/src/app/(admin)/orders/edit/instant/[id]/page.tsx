import { InstantOrderPage } from '@pages/(admin)/orders/create/instant/instant-order-page';

interface EditInstantOrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditInstantOrderPage({ params }: EditInstantOrderPageProps) {
  const { id } = await params;
  
  return <InstantOrderPage mode="edit" id={id} />;
}

export async function generateMetadata({ params }: EditInstantOrderPageProps) {
  const { id } = await params;
  
  return {
    title: `Редактировать мгновенный заказ ${id} | Compass Admin`,
    description: 'Редактирование мгновенного заказа',
  };
}
