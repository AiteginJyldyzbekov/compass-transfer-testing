import { InstantOrderPage } from '@pages/(admin)/orders';

export default function CreateInstantOrderPage() {
  return <InstantOrderPage mode="create" />;
}

export const metadata = {
  title: 'Создать мгновенный заказ | Compass Admin',
  description: 'Создание нового мгновенного заказа',
};
