import { redirect } from 'next/navigation';

export default function PartnerEditPage() {
  redirect('/users?role=Partner');
}