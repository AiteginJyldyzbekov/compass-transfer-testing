import { OrderPage } from '@pages/(admin)/orders';

export default function CreateInstantOrderPage() {
  return <OrderPage mode="create" />;
}

export const metadata = {
  title: 'Создать мгновенный заказ | Compass Admin',
  description: 'Создание нового мгновенного заказа',
};
