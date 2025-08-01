import { OrderPage } from '@pages/(admin)/orders';

export default function CreateScheduledOrderPage() {
  return <OrderPage mode="create" />;
}

export const metadata = {
  title: 'Создать запланированный заказ | Compass Admin',
  description: 'Создание нового запланированного заказа',
};
