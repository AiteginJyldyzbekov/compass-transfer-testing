import DriverDashboardPage from '@pages/(driver-mobile)/dashboard/driver-dashboard-page';

/**
 * Главная страница мобильного приложения для водителей
 */
export default function Page() {
  return <DriverDashboardPage />;
}

export const metadata = {
  title: 'Compass Driver - Главная',
  description: 'Мобильное приложение для водителей Compass Transfer',
};
