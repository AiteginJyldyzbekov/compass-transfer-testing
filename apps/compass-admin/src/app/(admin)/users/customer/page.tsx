import { redirect } from 'next/navigation';

export default function CustomerEditPage() {
  redirect('/users?role=Customer');
}