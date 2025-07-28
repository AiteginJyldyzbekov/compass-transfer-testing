import { redirect } from 'next/navigation';

export default function AdminEditPage() {
  redirect('/users?role=Admin');
}