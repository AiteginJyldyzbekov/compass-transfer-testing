import { MeProfileView } from '@pages/(admin)/my-profile';

export default function ProfilePage() {
  return <MeProfileView />;
}

export async function generateMetadata() {
  return {
    title: 'Мой профиль | Compass Admin',
    description: 'Просмотр информации о текущем пользователе',
  };
}
