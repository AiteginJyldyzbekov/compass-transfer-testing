import type { Metadata } from 'next';
import { MeProfileEditView } from '@pages/(admin)/me-profile/edit';

export const metadata: Metadata = {
  title: 'Редактирование профиля',
  description: 'Редактирование информации профиля пользователя',
};

export default function ProfileEditPage() {
  return (
    <div className='container p-4 pr-2 border rounded-2xl overflow-hidden shadow-sm h-full bg-white'>
      <div className='overflow-y-auto h-full pr-2'>
        <MeProfileEditView />
      </div>
    </div>
  );
}
