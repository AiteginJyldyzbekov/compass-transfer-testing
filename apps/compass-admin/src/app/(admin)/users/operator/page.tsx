import { redirect } from 'next/navigation';

export default function OperatorEditPage() {
  redirect('/users?role=Operator');
}