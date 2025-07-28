import { redirect } from 'next/navigation';

export default function DriverEditPage() {
  redirect('/users?role=Driver');
}