import { getUserFromCookie } from '@shared/lib/parse-cookie';
import { Role } from '@entities/users/enums';
import { ScheduledOrderPage } from '@pages/(admin)/orders/create/scheduled';

export default async function CreateScheduledOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ tariffId?: string }>;
}) {
  const params = await searchParams;

  // Получаем роль пользователя
  const userRole = (await getUserFromCookie('role')) as Role | null;

  // Преобразуем роль в строку для компонента
  const roleString = (() => {
    switch (userRole) {
      case Role.Admin:
        return 'admin';
      case Role.Operator:
        return 'operator';
      case Role.Partner:
        return 'partner';
      case Role.Driver:
        return 'driver';
      default:
        return 'operator';
    }
  })();

  return <ScheduledOrderPage mode="create" initialTariffId={params.tariffId} userRole={roleString} />;
}

export const metadata = {
  title: 'Создать запланированный заказ | Compass Admin',
  description: 'Создание нового запланированного заказа',
};
